
const users = {
  'admin': {
    'roles': [
      {
        'role': 'permission_manager',
        'permissions': [
          {
            'method': 'POST',
            'url': '/user/save',
            'id': 3
          },
          {
            'method': 'DELETE',
            'url': '/user/removeBatch',
            'id': 5
          },
          {
            'method': 'DELETE',
            'url': '/user/remove',
            'id': 12
          },
          {
            'method': 'GET',
            'url': '/user/listByPage',
            'id': 14
          },
          {
            'method': 'PUT',
            'url': '/user/resetPassword',
            'id': 16
          },
          {
            'method': 'PUT',
            'url': '/user/update',
            'id': 18
          },
          {
            'method': 'GET',
            'url': '/role/listByUserId',
            'id': 1
          },
          {
            'method': 'GET',
            'url': '/role/listByPage',
            'id': 6
          },
          {
            'method': 'DELETE',
            'url': '/role/remove',
            'id': 7
          },
          {
            'method': 'PUT',
            'url': '/role/update',
            'id': 9
          },
          {
            'method': 'POST',
            'url': '/role/save',
            'id': 10
          },
          {
            'method': 'GET',
            'url': '/role/list',
            'id': 15
          },
          {
            'method': 'DELETE',
            'url': '/role/removeBatch',
            'id': 17
          },
          {
            'method': 'DELETE',
            'url': '/permission/remove',
            'id': 2
          },
          {
            'method': 'GET',
            'url': '/permission/getByRid',
            'id': 4
          },
          {
            'method': 'GET',
            'url': '/permission/listByPage',
            'id': 8
          },
          {
            'method': 'DELETE',
            'url': '/permission/removeBatch',
            'id': 11
          },
          {
            'method': 'GET',
            'url': '/permission/list',
            'id': 19
          },
          {
            'method': 'GET',
            'url': '/permission/listByTree',
            'id': 20
          },
          {
            'method': 'POST',
            'url': '/permission/save',
            'id': 22
          },
          {
            'method': 'PUT',
            'url': '/permission/update',
            'id': 24
          }
        ],
        'name': '权限管理员',
        'id': 1
      },
      {
        'role': 'user_manager',
        'permissions': [
          {
            'method': 'POST',
            'url': '/user/save',
            'id': 3
          },
          {
            'method': 'DELETE',
            'url': '/user/removeBatch',
            'id': 5
          },
          {
            'method': 'DELETE',
            'url': '/user/remove',
            'id': 12
          },
          {
            'method': 'GET',
            'url': '/user/listByPage',
            'id': 14
          },
          {
            'method': 'PUT',
            'url': '/user/resetPassword',
            'id': 16
          },
          {
            'method': 'PUT',
            'url': '/user/update',
            'id': 18
          }
        ],
        'name': '用户管理',
        'id': 2
      },
      {
        'role': 'admin',
        'permissions': [],
        'name': '系统管理员',
        'id': 4
      }
    ],
    'token': 'eyJhbGciOiJSUzI1NiJ9.eyJlY2RzX3VzZXIiOiJ7XCJuaWNrbmFtZVwiOlwi57O757uf566h55CG5ZGYXCIsXCJpZFwiOjMsXCJ1c2VybmFtZVwiOlwiYWRtaW5cIn0iLCJqdGkiOiJZamRqTTJFd05UQTBPR0kxTkdNNVlUZ3pOVFZrTldNNFkyRmhOVFJqTnpVPSIsImV4cCI6MTU5OTg3OTI4OX0.tiLXWZtT69hSvuZdDTMc7fWcn8nD3PkJPX8JzXG0HZK7r4xR7eZE9lG1BLreCwh4VgZo30Fnf_LeHc7FzaP7-IxZ9kYJ4T6DmgMEEJhvvC51-5bwEpHnmedvU3cnMU6TnRXzT8dNp5xCTLiN0IizHoZ9K3z_JKWDgfcj2K9XoYKUN-WeF8stfJBNmTKiePP3XVS3OIvdVIuhqkEYgCGQylMNqbSrpeQr40TLx81sOfVi74pxbQmLUEhn2b91DE0A_fhevoe0YOEIBqroSniPSTgo2DBs_RBtT0GvoJqTwQvjEEWrO2lMS2VyoW1v-3RZF47uhGotOGUTbss7C7v0Vg',
    'nickname': '系统管理员',
    'id': 3,
    'username': 'admin',
    'agenCode': '112233',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'financial': {
    'roles': [
      {
        'role': 'financial',
        'permissions': [],
        'name': '财政端',
        'id': 3
      }
    ],
    'token': 'eyJhbGciOiJSUzI1NiJ9.eyJlY2RzX3VzZXIiOiJ7XCJuaWNrbmFtZVwiOlwi6LSi5pS_XCIsXCJpZFwiOjQsXCJ1c2VybmFtZVwiOlwiZmluYW5jaWFsXCJ9IiwianRpIjoiWXpVMk5URTBZV00yWTJReE5HUmpOVGhoTVRjMFpUUmtPREUyTkRjeVlqRT0iLCJleHAiOjE1OTk4Nzk0MDF9.gJw2_qyhqlYSwVQOokVu96rY671WhUUOyhN4KRt8di3Bz3ZEJukQoYlpKPVHkD95_YqMoYrFuRT52sjVAtWeMRk31mXHO_cyFXMHAbRlwpQTgzkWNLCyvTCCXjSmpXp1iTY-acgmEH6jCG8WneAUenI1Ws1SyOVPh0WRQpMPZwn1AsdYxsnClWo4cCWz25WkMnE13RcdXqKky6IiV1Q4QneUKteCmF1Ok3b_og-w6X8XoIIewGUBo1-kHwHXeksZSvRbg-w71ij-lqZrjOVMG7S9c-8YL8gfEBqmQVeCNSMOsFSFw6d-5C7PAbh-iPD8L0TZAUFAvmpcyv905oT7Qw',
    'nickname': '财政',
    'id': 4,
    'username': 'financial',
    'agenCode': '112233',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'financial_check': {
    'roles': [
      {
        'role': 'financial_check',
        'permissions': [],
        'name': '财政端_审查',
        'id': 3
      }
    ],
    'token': 'eyJhbGciOiJSUzI1NiJ9.eyJlY2RzX3VzZXIiOiJ7XCJuaWNrbmFtZVwiOlwi6LSi5pS_XCIsXCJpZFwiOjQsXCJ1c2VybmFtZVwiOlwiZmluYW5jaWFsXCJ9IiwianRpIjoiWXpVMk5URTBZV00yWTJReE5HUmpOVGhoTVRjMFpUUmtPREUyTkRjeVlqRT0iLCJleHAiOjE1OTk4Nzk0MDF9.gJw2_qyhqlYSwVQOokVu96rY671WhUUOyhN4KRt8di3Bz3ZEJukQoYlpKPVHkD95_YqMoYrFuRT52sjVAtWeMRk31mXHO_cyFXMHAbRlwpQTgzkWNLCyvTCCXjSmpXp1iTY-acgmEH6jCG8WneAUenI1Ws1SyOVPh0WRQpMPZwn1AsdYxsnClWo4cCWz25WkMnE13RcdXqKky6IiV1Q4QneUKteCmF1Ok3b_og-w6X8XoIIewGUBo1-kHwHXeksZSvRbg-w71ij-lqZrjOVMG7S9c-8YL8gfEBqmQVeCNSMOsFSFw6d-5C7PAbh-iPD8L0TZAUFAvmpcyv905oT7QS',
    'nickname': '财政_审查',
    'id': 4,
    'username': 'financial',
    'agenCode': '112233',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'unit': {
    'roles': [
      {
        'role': 'unit',
        'permissions': [],
        'name': '单位端',
        'id': 4
      }
    ],
    'token': 'eyJhbGciOiJSUzI1NiJ9.eyJlY2RzX3VzZXIiOiJ7XCJuaWNrbmFtZVwiOlwi5Y2V5L2N56uvXCIsXCJpZFwiOjUsXCJ1c2VybmFtZVwiOlwidW5pdFwifSIsImp0aSI6Ill6TTVOekkyTjJWbE9HRmpOR1JqT1dKaVpEQXhOamRtWVRGaE1qUmpNMlk9IiwiZXhwIjoxNTk5ODc5NDE2fQ.MFUKOZ0gjEvmY1svvjs0BOI3DjHD_RPyGkrstp7qoWKMVgJlj_BYGUOIghNszZHrD3aq_QYsydZb8ZZ7B1mJWfMwqXDqgnCrbYY2-appCOLds_VtSC44BqlY2LZmJp0kqmBM_MJQ1bF5Ua5_n7Ed4myPnqTxVPNkT_D5eZcmdbQDTvGbL7KkHGeN8rF0FpIAcT-cELDAPYoWPSFD-auZ-k6_VA66PehA2Ge2GLJDOgsSjMPXBWpqu_aTLMKsd-cdcDeGLH6VHEyVuSdNOpVvvbmUL9ov2obPsDSCxHHcc2a2v6gw1v_HUBEfeoHQwrT5PPIpn2HJqzcDCjkuDi916g',
    'nickname': '单位端',
    'id': 5,
    'username': 'unit',
    'agenCode': '112233',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }
}

module.exports = [
  // user login
  {
    url: process.env.VUE_APP_BASE_API + '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const user = users[username]
      if (!user) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
      const token = user.token
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: { token }
      }
    }
  },

  // get user info
  {
    url: process.env.VUE_APP_BASE_API + '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      let info = {}

      for (const key in users) {
        if (users[key].token === token) {
          info = users[key]
          break
        }
      }

      // mock error
      if (info === {}) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: process.env.VUE_APP_BASE_API + '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
