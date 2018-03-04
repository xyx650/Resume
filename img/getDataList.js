let fs=require('fs'),
    arr=fs.readdirSync('./'),
    result=[];
arr.forEach(function (item) {
    if (/\.(PNG|GIF|JPG)$/i.test(item)) {
        // let obj={};
        // obj._src=`img/` + item;
        result.push(`img/` + item);
    }
});
fs.writeFileSync('./result.txt', JSON.stringify(result), 'utf-8');