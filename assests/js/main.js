$(document).ready(function(){
    $(".modal").hide();
    console.log("start");
    initEvent();
    loadData();
    console.log("end")
});
var employeeId = null;
var formMode = "add";
function initEvent(){
    // Ẩn hiện form thông tin sinh viên
    $(".dashboard__data-addemployee").on("click", ()=>{
        formMode="add"
        $(".modal-employee-information").show();
        $(".container__body-infor input").val(null)
        $.ajax({
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            success: function(newEmployeeCode) {
                $("#txtEmployeeCode").val(newEmployeeCode);
                $("#txtEmployeeCode").focus();
            }
        });

    })
     $('input[required]').blur(function() {
        // Lấy ra value:
        var value = this.value;
        // Kiểm tra value:
        if (!value) {
            // ĐẶt trạng thái tương ứng:
            // Nếu value rỗng hoặc null thì hiển thị trạng thái lỗi:
            $(this).addClass("input--error");
            $(this).attr('title', "Thông tin này không được phép để trống");
        } else {
            // Nếu có value thì bỏ cảnh báo lỗi:
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })
    $(".modal__container-exit").click(function (){
        $(this).parents(".modal").hide();
    })
    $(".modal__container-footer-cancel").click(function (){
        $(this).parents(".modal").hide();
    })
    $(".btnOK").click(function(){
        $(this).parents(".modal").hide();
    })
    $(document).on('click', 'table#data__EmployeeList tbody tr', function() {
        // Xóa tất cả các trạng thái được chọn của các dòng dữ liệu khác:
        $(this).siblings().removeClass('row-selected');
        // In đậm dòng được chọn:
        this.classList.add("row-selected");
        employeeId = $(this).data('id');
    });
    $(".btnDelete").click(function(){
        if(employeeId===null)
        {
            $(".modal__anouncement--delete").show();
        }
        else{
            $(".modal__anouncement--selected-delete").show();
        }
    })
    $(".bntOK--Delete").click(function() {
        // Gọi api thực hiện xóa:
        $.ajax({
            type: "DELETE",
            url: "https://cukcuk.manhnv.net/api/v1/employees/" + employeeId,
            success: function(response) {
                $(".modal__anouncement--selected-delete").hide();
                // Load lại dữ liệu:
                loadData();
            }
        });
    });
    //---------
    // Validate form
    $('input[required]').blur(function() {
        // Lấy ra value:
        let value = this.value;
        // Kiểm tra value:
        if (!value) {
            // ĐẶt trạng thái tương ứng:
            // Nếu value rỗng hoặc null thì hiển thị trạng thái lỗi:
            $(this).addClass("input--error");
            $(this).attr('title', "Thông tin này không được phép để trống");
        } else {
            // Nếu có value thì bỏ cảnh báo lỗi:
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })
    //---------------
    //Rút gọn menu
    $(".dasboard__heading__icon").click(()=>{
        $(".dashboard__category-title").toggleClass("disable");
        $(".dasboard__heading__logo").toggleClass("disable");
        $(".dasboard__info__logo-center").toggleClass("disable");
    })
    //--------
    //Reload
    $(".dashboard__filter-refresh").click(()=>{
       loadData()
    })
    
    //-------
    //Chỉnh sửa thông tin nhân viên
    $(document).on('dblclick','table#data__EmployeeList tbody tr', function(){
        formMode="edit";
        $(".modal-employee-information").show();
        $(".container__body-infor input")[0].focus()
        let data = $(this).data('entity');
        employeeId=$(this).data('id');
        //Xử lí data để hiển thị form
        data["DateOfBirth"]=formatDate2(data["DateOfBirth"]);
        data["IdentityDate"]=formatDate2(data["IdentityDate"]);
        data["JoinDate"]=formatDate2(data["JoinDate"]);
        //------
        let inputs = $(".container__body-infor input, .container__body-infor select");
        for (const input of inputs) {
            // Đọc thông tin propValue:
            const propValue = $(input).attr("propValue");
            console.log(propValue)
            if (propValue) {
                let value = data[propValue];
                console.log(value)
                input.value = value;
            }
        }
     })
    //-------
    //Lưu
    $("#btnSave").click((event)=>{
        event.preventDefault();
        let validateform=true;
        console.log(employeeId)
        let inputs=$('input[required]')
        for( var input of inputs)
        {
            let value =input.value;
            if(!value){
                validateform=false;
            }
        }
        if(validateform==true)
        {
            saveData();
        }
        else{
            $(".modal__anouncement--validate-form").show()
        }
    });
    //----------
}
//SaveData
function saveData() {
    // Thu thập dữ liệu:
    let inputs = $(".container__body-infor input, .container__body-infor select");
    let employee = {};
    console.log("Đối tượng Employee trước khi build");
    console.log(employee);
    // build object:
    for (const input of inputs) {
        // Đọc thông tin propValue:
        const propValue = $(input).attr("propValue");
        // Lấy ra value:
        if (propValue) {
            let value = input.value;
            employee[propValue] = value;
            
        }
    
    }
    console.log("Đối tượng Employee sau khi build");
    console.log(employee);
    // Gọi api thực hiện cất dữ liệu:
    if (formMode == "edit") {
        $.ajax({
            type: "PUT",
            url: "https://cukcuk.manhnv.net/api/v1/Employees/" + employeeId,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                //alert("Sửa dữ liệu thành công!");
                $(".modal__anouncement--edit").show()
                // load lại dữ liệu:
                loadData();
                // Ẩn form chi tiết:
                $(".modal-employee-information").hide();

            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "https://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                //alert("Thêm mới dữ liệu thành công!");
                $(".modal__anouncement--add").show()
                // load lại dữ liệu:
                loadData();
                // Ẩn form chi tiết:
                $(".modal-employee-information").hide();

            }
        });
    }
}
//-------
// Load data
function loadData(){
    $.ajax({
        type: "GET",
        url: "https://cukcuk.manhnv.net/api/v1/Employees",
        async: false,
        success: function (response) 
        {
            $("table tbody").empty();
            let sort = 1;
            let ths = $("table#data__EmployeeList thead th");
            for (const employee of response) 
            {
                // duyệt từng cột trong tiêu đề:
                var trElement = $('<tr></tr>');
                for (const th of ths) 
                {
                    // Lấy ra propValue tương ứng với các cột:
                    const propValue = $(th).attr("propValue");

                    const format = $(th).attr("format");
                    // Lấy giá trị tương ứng với tên của propValue trong đối tượng:
                    let value = null;
                    let classAlign = "";
                    if (propValue == "Sort")
                    {
                        value = sort;
                    }
                    else
                    {
                        value = employee[propValue];
                    }
                    switch (format) 
                    {
                        case "date":
                            value = formatDate(value);
                            break;
                        case "money":
                            //value = Math.round(Math.random(100) * 1000000);
                            value = formatMoney(value);
                            classAlign = "text-align-right";
                            break;
                        default:
                            break;
                    }
                    
                    // Tạo thHTML:
                    let thHTML = `<td class='${classAlign}'>${value||""}</td>`;

                    // Đẩy vào trHMTL:
                    trElement.append(thHTML);
                }
                sort++;
                $(trElement).data("id", employee.EmployeeId);
                $(trElement).data("entity", employee);
                $("table#data__EmployeeList tbody").append(trElement)
        }
    },
    error: function(res) {
        console.log(res);
    }
    });
}
function formatDate(date) {
    try {
        if (date) {
            date = new Date(date);

            // Lấy ra ngày:
            dateValue = date.getDate();
            dateValue = dateValue < 10 ? `0${dateValue}` : dateValue;

            // lấy ra tháng:
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;

            // lấy ra năm:
            let year = date.getFullYear();

            return `${dateValue}/${month}/${year}`;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
    }
}
function formatDate2(date) {
    try {
        if (date) {
            date = new Date(date);

            // Lấy ra ngày:
            dateValue = date.getDate();
            dateValue = dateValue < 10 ? `0${dateValue}` : dateValue;

            // lấy ra tháng:
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;

            // lấy ra năm:
            let year = date.getFullYear();

            return `${year}-${month}-${dateValue}`;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
    }
}
function formatMoney(money) {
    try {
        money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
        return money;
    } catch (error) {
        console.log(error);
    }
}
