function Upload() {
    //Reference the fileUploader element.
    let fileUploader = document.getElementById("fileUploader");

    //Validate whether File is valid Excel file.
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUploader.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUploader.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    let data = "";
                    let bytes = new Uint8Array(e.target.result);
                    for (let i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUploader.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};

function ProcessExcel(data) {
    let previewer = document.querySelector('.excelfile');

    //Read the Excel File data.
    let workbook = XLSX.read(data, {type: 'binary'});

    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    let excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    
    // console.log(excelRows);
    brandNames = []
    excelRows.forEach(row => {
        return brandNames.push(row['Brand Name']);
    });
    
    brandNames.forEach(brandName => {
        if (!brandName.includes('_') && !brandName.includes('.com') && !brandName.includes('.net')) {
            axios.get(`https://www.facebook.com/${brandName}`, brandName)
                .then(data => {
                    console.log(brandName, data.status);
                }).catch(error =>
                    console.log(JSON.stringify(error))
                );
        
        } else {
            console.log(` ${brandName} brand name isn't available`)
        }
    })
    let excelHTML = XLSX.utils.sheet_to_html(workbook.Sheets[firstSheet]);
    // console.log(excelHTML);
    // add sheet to the html
    previewer.innerHTML = excelHTML;
}