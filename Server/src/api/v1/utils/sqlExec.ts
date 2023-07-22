import conn from "../../../config/initDB";

const sqlExec = (query: string, params?: any[]): Promise<any> => {
  if (params === undefined || params.length === 0) {
    return new Promise((resolve, reject) => {
      conn.execute(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  return new Promise((resolve, reject) => {
    conn.execute(
      query,
      (params === undefined ? [] : params ?? []).map((v) => (v === undefined ? null : v)),
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });
};

export default sqlExec;
