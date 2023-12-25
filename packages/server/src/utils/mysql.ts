const mysql = require('mysql')

interface MySQL_Obj {
    host: string
    user: string
    password: string
    port: number
    database: string
}

function init(obj: MySQL_Obj) {
    const connected = mysql.createConnection({
        host: obj.host,
        user: obj.user,
        password: obj.password,
        port: obj.port,
        database: obj.database
    })
    return connected
}

export class MySQL {
    MySQL_obj
    constructor(config: MySQL_Obj) {
        this.MySQL_obj = init(config)
    }
    Connect() {
        this.MySQL_obj.connect()
    }
    GetData(sql: string) {
        this.MySQL_obj.query(sql, (err: string, data: any) => {
            if (err) {
                return err
            } else {
                return data
            }
        })
    }
    Close() {
        this.MySQL_obj.end()
    }
}
