
const apiList = require('../config/apis');
class AccessLogs {

    static getAPIList() {
        const tempJson = {};
        const keys = Object.keys(apiList);
        for (let i = 0, length = keys.length; i < length; i++) {
            const innerKeys = Object.keys(apiList[keys[i]]);
            for (let j = 0, len = innerKeys.length; j < len; j++) {
                const t = {};
                if (!tempJson.hasOwnProperty(apiList[keys[i]][innerKeys[j]]['category'])) {
                    tempJson[apiList[keys[i]][innerKeys[j]]['category']] = [];
                }
                t['API_Name'] = apiList[keys[i]][innerKeys[j]]['name'];
                t['API_Endpoint'] = innerKeys[j];
                t['Method'] = [keys[i]];
                t['Hash'] = apiList[keys[i]][innerKeys[j]]['id'];

                tempJson[apiList[keys[i]][innerKeys[j]]['category']].push(t);
            }
        }
        const ordered = {};
        Object.keys(tempJson).sort().forEach(key => ordered[key] = tempJson[key]);
        return ordered;
    }
    
}

module.exports = AccessLogs;