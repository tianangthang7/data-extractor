const XLSX = require("xlsx");
const fs = require('fs');
const csv = require('csv-parser');
const zlib = require('zlib');
const archiver = require('archiver');
const http = require('http');
const request = require('request');
const Papa = require('papaparse');


let phoneNumberDict = {
    // # Viettel
    '0169': '039',
    '0168': '038',
    '0167': '037',
    '0166': '036',
    '0165': '035',
    '0164': '034',
    '0163': '033',
    '0162': '032',
    '086': '086',
    '096': '096',
    '097': '097',
    '098': '098',
    // # Vina
    '091': '091',
    '094': '094',
    '0128': '088',
    '0123': '083',
    '0124': '084',
    '0125': '085',
    '0127': '081',
    '0129': '082',
    // # Mobi
    '0120': '070',
    '0121': '079',
    '0122': '077',
    '0126': '076',
    '0128': '078',
    '089': '089',
    '090': '090',
    '093': '093',
    // # Vietnamobile
    '092': '092',
    '0182': '052',
    '0186': '056',
    '0188': '058',
    // # Gmobile
    '099': '099',
    '0199': '059',
    '087': '087'
}
function normalizePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.toString();

    // Xóa khoảng trắng và các dấu gạch ngang
    let normalized = phoneNumber.replace("\n", "-");
    normalized = normalized.replace(/[\s.]/g, '');
    // Nếu không có số 0, thêm số 0 ở đầu 
    if (!normalized.startsWith('0')) {
        normalized = '0' + normalized;
    }
    if (normalized.length < 10) {
        return;
    }

    if (normalized.length > 11) {
        try {
            normalized = normalized.match(/(84|0[1|3|5|7|8|9])+([0-9]{8,10})/)[0];
        } catch (error) {
            console.error("Cannot normal phonenumber ", normalized);
            return;
        }
    }
    // Xóa tất cả các ký tự không phải số và dấu cộng (+) ở đầu
    normalized = normalized.replace(/[^0-9+]/g, '');

    // Nếu có dấu cộng ở đầu, chuyển thành số 0
    if (normalized.startsWith('+84')) {
        normalized = '0' + normalized.slice(3);
    }


    // Nếu đầu số có 11 số, bỏ số 0 đầu tiên
    if (normalized.length === 11 && normalized.startsWith('0')) {
        try {
            normalized = phoneNumberDict[normalized.slice(0, 4)] + normalized.slice(3);
        } catch (error) {
            console.error("Cannot normal phonenumber ", normalized);
            return;

        }
    }

    // Nếu đầu số có 10 số và không bắt đầu bằng số 0, thêm số 0 vào đầu
    if (normalized.length === 9 && !normalized.startsWith('0')) {
        normalized = '0' + normalized;
    }

    return normalized;
}
function findHeader(data, colNameIndex) {
    for (let index = 0; index < data.length; index++) {
        let row = data[index];
        for (let item of row) {
            if (item) {
                item = item.toString();
                for (let keyword of colNameIndex["phone"]["keywords"]) {
                    if (item && item.toLowerCase().includes(keyword)) {
                        console.log(item);
                        return index;
                    }
                }
            }

        }
    }
    return -1;
}
function normalizeGender(gender) {
    let anh = ["ông", "nam", "anh", "mr", "male", "m"];
    let chi = ["bà", "nữ", "chị", "mrs", "female", "f"];
    gender = gender.normalize();
    if (anh.includes(gender.toLowerCase())) {
        return "anh";
    } else if (chi.includes(gender.toLowerCase())) {
        return "chị";
    } else {
        console.log(gender);
        return "anh/chị";
    }
}

async function handleFile(parsedData) {
    let colNameIndex = {
        name: { keywords: ["name", "khach hang", "tên", "họ tên", "họ và tên", "họ & tên", "họ & tên khách hàng", "hội viên"] },
        gender: { keywords: ["gender", "gioi tinh", "giới tính", "phái", "giới"] },
        phone: { keywords: ["phone", "liên hệ", "dt", "dien thoai", "so dien thoai", "sđt", "sdt", "số đt", "phone number", "số điện thoại", "điện thoại", "di động"] },
        birthday: { keywords: ["birthday", "ngày sinh", "sinh nhật"] },
        email: { keywords: ["email", "mail"] },
        note: { keywords: ["note", "ghi chú"] },
        extra_info: { keywords: ["extra_info", "extra info"] }

    }
    // find header
    const headerIndex = findHeader(parsedData.slice(0, 10), colNameIndex);
    const header = parsedData[headerIndex];
    console.log("header", header);
    if (headerIndex == -1) {
        console.warn("cannot find header!");
        return [];
    }
    let isFound = false;
    for (let index = 0; index < header.length; index++) {
        if (!header[index]) {
            continue;
        }
        let colName;
        try {
            colName = header[index].toLowerCase();
        } catch (error) {
            continue;
        }
        for (let col of Object.keys(colNameIndex)) {
            let keywords = colNameIndex[col]['keywords'];
            keywords.forEach((word) => { if (colName.includes(word)) { colNameIndex[col].index = index; isFound = true } });
        }
    }
    if (!Object.keys(colNameIndex).includes("phone")) {
        return;
    }
    if (isFound) {
        // console.log("colNameIndex", colNameIndex);
        let result = [];
        for (let i = headerIndex + 1; i < parsedData.length; i++) {
            let contact = {};
            let row = parsedData[i];
            for (let col of Object.keys(colNameIndex)) {
                let index = colNameIndex[col].index;
                if (index != undefined && row[index]) {
                    if (col == 'phone') {
                        try {
                            contact[col] = normalizePhoneNumber(row[index]);
                        } catch (error) {
                            console.error(error, row[index]);
                            continue;
                        }
                    }
                    else if (col == "gender") {
                        contact[col] = normalizeGender(row[index]);
                    }
                    else {
                        contact[col] = row[index];
                    }
                }
            }
            if (Object.keys(contact).includes("phone") && contact.phone) {
                result.push(contact);
            }
        }
        console.log(result);
        return result;
    }
}
async function importData(filePath) {
    let results = [];
    let fileType = filePath.split(".").pop();
    if (fileType === 'xls' || fileType === 'xlsx') {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        for (let sheetName of sheetNames) {
            const sheet = workbook.Sheets[sheetName];
            let sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            sheetDataParsed = await handleFile(sheetData);
            results.push(sheetDataParsed);
        }
    } else if (fileType === 'csv') {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const results = Papa.parse(data, { header: false });
                resolve(await handleFile(results.data));
            });
        });
    } else {
        throw new Error('Invalid file type');
    }
    return results.flat();
}
async function openFiles() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = ".csv,.xlsx,.xls";
        input.addEventListener('change', async (event) => {
            const files = event.target.files;
            resolve(files);
        });
        input.click();
    });
}


function zipFiles(files) {
    console.log(files);


    const now = new Date();
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const dateString = now.toLocaleDateString('vi-VN', options).replace(/\//g, '');
    const fileZipName = `${__dirname}/${dateString}.zip`;
    const output = fs.createWriteStream(fileZipName);
    const archive = archiver('zip', {
        zlib: { level: 9 } // set compression level
    });

    output.on('close', () => {
        console.log(`${archive.pointer()} [total bytes compressed]`)
        sendFile(fileZipName);
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    for (let file of files) {
        archive.file(file.path, { name: file.path });
    }
    archive.finalize();
}
function sendFile(fileName) {
    let user = window.database.get("user");
    if (user) {
        let access_token = user["access_token"];
        var fs = require('fs');
        var options = {
            'method': 'POST',
            'url': 'https://api.myassistant.vn/file-upload/',
            'headers': {
                'Authorization': `Bearer ${access_token}`
            },
            formData: {
                'file': {
                    'value': fs.createReadStream(`${fileName}`),
                    'options': {
                        'filename': fileName,
                        'contentType': null
                    }
                }
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log("response.body");
            fs.unlinkSync(fileName);
        });
    } else {
        console.log("khong thay token");
    }
}
async function openFolder() {
    return new Promise((resolve, reject) => {
        const folderInput = document.createElement("input");
        folderInput.setAttribute("type", "file");
        folderInput.setAttribute("id", "folder-selector");
        folderInput.setAttribute("name", "folder");
        folderInput.setAttribute("directory", "");
        folderInput.setAttribute("webkitdirectory", "");
        folderInput.setAttribute("accept", ".csv,.xlsx, .xls");
        folderInput.addEventListener('change', async (event) => {
            const files = event.target.files;
            const result = [];
            for (const file of files) {
                if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    result.push(file);
                }
            }
            resolve(result);
        });
        folderInput.click();
    });
}


module.exports = { importData, zipFiles, openFiles, openFolder }