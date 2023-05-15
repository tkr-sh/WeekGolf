
const addRank = (object: any, keyPoint: string, asc: boolean) => {
    const tempObject = object.sort(
        (a: any, b: any) => asc ? a[keyPoint] - b[keyPoint] : b[keyPoint] - a[keyPoint]
    );

    let rank = 1;
    let userWithSameRank = 0;
    let previous_score = -1;

    for (const user of tempObject) {
        if (previous_score !== user[keyPoint]) {
            rank += userWithSameRank;
            userWithSameRank = 1;
        } else {
            userWithSameRank++;
        }

        previous_score = user[keyPoint];

        user["rank"] = rank;
    }


    return tempObject;
}


export default addRank;