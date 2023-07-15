import Token from '@/app/utils/token'

interface User {
  username: string,
  password: string,
  // 过期时间
}

interface LoginUser {
  uid: string
  token: string
}

class Auth {
  userTable: Map<string, string>
  // userIdTable: Map<string, string>
  constructor() {
    this.userTable = new Map<string, string>()
  }
  // 检查已注册
  isRegister(username: string) {
    return this.userTable.has(username)
  }

  register(username: string, password: string) {
    if (this.isRegister(username)) {
      return {
        err: new Error('the username has registered already'),
        data: null
      }
    }
    
    const token = Token.createToken({username, password})
    this.userTable.set(username, password) // ignore create_time etc...

    return {
      err: null,
      data: {
        token
      }
    }
  }

  login(username: string ,password: string) {
    // user表内找不到username对应的uid，所以算作没注册
    if (!this.userTable.has(username)) {
      return {
        err: new Error('user is not registered'),
        data: null
      }
    }

    // 验证密码
    const pwd = this.userTable.get(username)
    if (pwd !== password) {
      return {
        err: new Error('password error'),
        data: null
      }
    }

    // user表内有数据。根据 client新上传的 username & pwd 来生成一个新的token
    // update token
    const token = Token.createToken({username, password})
    return {
      err: null,
      data: {
        token
      }
    }
  }

  check(token: string) {
    if (!token) {
      return {
        err: new Error('no token'),
        data: null
      }
    }

    const validToken = Token.checkToken(token)
    if (!validToken) {
      console.log('current token: ', token)
      return {
        err: new Error('It\'s not Login'),
        data: null
      }
    }

    // token验证成功，登录成功
    return {
      err: null,
      data: null
    }
  }
}

const auth = new Auth()
export default auth
