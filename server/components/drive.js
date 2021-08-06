const disk = require('ya-disk');
// {
//     download: { link: [AsyncFunction: link] },
//     info: [AsyncFunction: info],
//     list: [AsyncFunction: list],
//     meta: { get: [AsyncFunction: get], add: [AsyncFunction: add] },
//     operations: [AsyncFunction: operations],
//     recent: [AsyncFunction: recent],
//     upload: {
//       link: [AsyncFunction: link],
//       remoteFile: [AsyncFunction: remoteFile]
//     },
//     resources: {
//       copy: [AsyncFunction: copy],
//       create: [AsyncFunction: create],
//       move: [AsyncFunction: move],
//       remove: [AsyncFunction: remove]
//     }
// }

class Drive{
    
    _token = null
    
    set _token(token){
        this._token = token ? token.toString() : null;
    }

    info = async () => {
        const API_TOKEN = this._token;
        try {
            const { total_space, used_space } = await disk.info(API_TOKEN);
            return ({
                total: `${Math.round(total_space / 1000000)}`,
                used: `${Math.round((total_space - used_space) / 1000000)}`
            })
            
        } catch (error) {
            console.error(error);
        };
    }

    list = async (path) => {
        const API_TOKEN = this._token;
        try {
            const list = await (disk.meta.get(API_TOKEN, path));
            console.log(list);
            return list;
        } catch (error) {
            console.error(error);
        };
    }
}

exports.module = new Drive();