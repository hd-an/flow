import axios from 'axios'
import { createdBy, orgId } from 'store/constant'
const BaseURL = '192.168.31.109'
const PORT = 8080
const url = `http://${BaseURL}:${PORT}/api/users/flowIse/${createdBy}/${orgId}`

export function getUsersArray() {
    return axios.get(url).then((res) => {
        let Data = res.data.data
        let orgId = Object.keys(Data)[0]
        let userIdArr = Object.values(Data)[0]
        return {
            orgId,
            userIdArr
        }
    })
}
