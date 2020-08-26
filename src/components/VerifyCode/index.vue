<template>
  <canvas ref="canvas" :width="width + 'px'" :height="height + 'px'" @click="DrawPic" />
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default () {
        return 120
      }
    },
    height: {
      type: Number,
      default () {
        return 40
      }
    },
    interfere: {
      type: Boolean,
      default () {
        return false
      }
    },
    length: {
      type: Number,
      default () {
        return 4
      }
    },
    value: {
      type: String,
      required: true
    }

  },
  data () {
    return {}
  },
  mounted () {
    this.DrawPic()
  },
  methods: {
    /** 生成一个随机数**/
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },

    /** 生成一个随机色**/
    randomColor (min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },

    DrawPic () {
      const width = this.$refs.canvas.width
      const height = this.$refs.canvas.height
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.textBaseline = 'bottom'

      /** 绘制背景色**/
      ctx.fillStyle = this.randomColor(180, 240) // 颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height)
      let verifyCode = ''
      /** 绘制文字**/
      const str = 'ABCEFGHJKLMNPQRSTWXY123456789'
      for (let i = 0; i < this.length; i++) {
        const txt = str[this.randomNum(0, str.length)]
        verifyCode += txt
        ctx.fillStyle = this.randomColor(50, 160) // 随机生成字体颜色
        ctx.font = this.randomNum(15, 40) + 'px SimHei' // 随机生成字体大小
        const x = 10 + i * 25
        const y = this.randomNum(25, 45)
        const deg = this.randomNum(-45, 45)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }

      if (this.interfere) {
        /** 绘制干扰线**/
        for (let i = 0; i < 8; i++) {
          ctx.strokeStyle = this.randomColor(40, 180)
          ctx.beginPath()
          ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height))
          ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height))
          ctx.stroke()
        }
        /** 绘制干扰点**/
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = this.randomColor(0, 255)
          ctx.beginPath()
          ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
      this.$emit('input', verifyCode)
    }
  }
}
</script>

<style scoped>

</style>
