module.exports.getAll=(con,callback)=>{
    con.query('select * from articles',callback)
}
module.exports.create=(con,data,callback)=>{
    con.query(`INSERT INTO articles(image,details)
    VALUES (${data.img},${data.details})`,callback)
}
module.exports.updateImage=(con,id,url,callback)=>{
    con.query( `UPDATE articles SET 
    image = ${url}
    WHERE id = ${id};
    select * from articles WHERE id = ${id}`,callback)
}
module.exports.updateDetails=(con,id,details,callback)=>{
    con.query( `UPDATE articles SET 
    details = ${details} 
    WHERE id = ${id};
    select * from articles WHERE id = ${id}`,callback)
}