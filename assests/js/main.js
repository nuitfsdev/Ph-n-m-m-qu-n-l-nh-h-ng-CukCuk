$(".modal").hide();
$(document).ready(function(){
    console.log("start");
    initEvent();
    loadData();
    console.log("end")
});
var employeeId = null;
var formMode = "add";
var pageNumber=1;//
var pageSize=20;
var searchEmployee='';
var positionFilter='';
var departmentFilter='';
var totalPage=0;
var btnPagingOne=1;
var btnPagingTwo=btnPagingOne+1;
var btnPagingThree=btnPagingTwo+1;
var btnPagingFour=btnPagingThree+1;




function initEvent(){
    // Hiện form thông tin sinh viên
    $(".dashboard__data-addemployee").on("click", ()=>{
        formMode="add";
        $(".modal-employee-information").show();
        $(".container__body-infor input").val(null);
        $(".container__body-infor select").val(null);
        $.ajax({
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            success: function(response) {
                $("#txtEmployeeCode").val(response);
                $("#txtEmployeeCode").focus();
            }
        });

    })
    //Thông báo các thông tin bắt buộc nhập
     $('input[required]').blur(function() {
        var value = this.value;
        if (!value) {
            $(this).addClass("input--error");
            $(this).attr('title', "Thông tin này không được phép để trống");
        } else {
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })
    //Bỏ lỗi khi nhất dấu x
    $(".modal__container-exit").click(function (){
        $(this).parents(".modal").hide();
        $('input[required]').removeClass("input--error");
        $('input[required]').removeAttr('title');
    })
    //Bỏ lỗi khi nhất dấu Hủy
    $(".modal__container-footer-cancel").click(function (){
        $(this).parents(".modal").hide();
        $('input[required]').removeClass("input--error");
        $('input[required]').removeAttr('title');
    })
    // Ẩn các thông báo
    $(".btnOK").click(function(){
        $(this).parents(".modal").hide();
    })
    //Chọn nhân viên
    $(document).on('click', 'table#data__EmployeeList tbody tr', function() {
        $(this).siblings().removeClass('row-selected');
        this.classList.add("row-selected");
        employeeId = $(this).data('id');
    });

    //Xử lí nhấn nút xóa
    $(".btnDelete").click(function(){
        if(employeeId===null)
        {
            //Hiện thông báo chưa chọn nhân viên
            $(".modal__anouncement--delete").show();
        }
        else{
            // Hiện thông báo xác nhận xóa
            $(".modal__anouncement--selected-delete").show();
        }
    })
    //Xử lí xóa nhân viên
    $(".bntOK--Delete").click(function() {
        // Gọi api thực hiện xóa:
        $.ajax({
            type: "DELETE",
            url: "https://cukcuk.manhnv.net/api/v1/employees/" + employeeId,
            success: function(response) {
                $(".modal__anouncement--selected-delete").hide();
                // Load lại dữ liệu
                $(".modal__anouncement--loading").show();
                    setTimeout(()=>{
                        loadData();
                        employeeId=null;
                        $(".modal__anouncement--loading").hide();
                    },500)
            }
        });
    });
    // Nhân bản
    $(".btnDuplicate").click(function(){
        if(employeeId===null)
        {
            //Hiện thông báo chưa chọn nhân viên
            $(".modal__anouncement--delete").show();
        }
        else{
            // Hiện thông báo xác nhận nhân bản
            $(".modal__anouncement--selected-duplicate").show();
        }
    })
    //Xử lí nhân bản khi nhấn OK
    $(".bntOK--Duplicate").click(function(){
        let employeeIdData;
        console.log(employeeId);
        //Gán thông tin nhân viên vào biên employeeIdData
        $.ajax({
            url: "https://cukcuk.manhnv.net/api/v1/Employees/" + employeeId,
            method: "GET",
            async: false,
            success: function(response) 
            {
                console.log(response);
                employeeIdData=response;
                console.log(employeeIdData.EmployeeCode);
            }
        });
        //Set giá trị EmployeeCode mới
        $.ajax({
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            async: false,
            success: function(newEmployeeCode) {
                employeeIdData.EmployeeCode=newEmployeeCode;
            }
        });
        console.log(employeeIdData.EmployeeCode);
        //Post dữ liệu
        $.ajax({
            type: "POST",
            url: "https://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employeeIdData),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                $(".modal__anouncement--loading").show();
                setTimeout(()=>{
                    loadData();
                    $(".modal__anouncement--loading").hide();
                    $(".modal__anouncement--add").show();
                    employeeId=null;
                },500);
            }
        });
        
    })
    //Tìm kiếm nhân viên theo keyword
    $(".dashboard__filter-search-input").blur(function(){
        searchEmployee=this.value;
        loadData();
    })
    //Tìm kiếm nhân viên theo departmentId
    $(".dashboard__filter-department").change(function(){
        departmentFilter=this.value;
        loadData();
    })
    //Tìm kiếm nhân viên theo positionId
    $(".dashboard__filter-position").change(function(){
        positionFilter=this.value;
        loadData();
    })
    //Chuyển trang
    $(".dashboard__pagination-previous").click(function(){
        if(pageNumber>1){
            pageNumber--;
            if(pageNumber%4==0)
            {
                btnPagingOne=(Math.floor(pageNumber/4)-1)*4 +1;
                btnPagingTwo=btnPagingOne+1;
                btnPagingThree=btnPagingTwo+1;
                btnPagingFour=btnPagingThree+1;
                $('.dashboard__pagination-one').text(btnPagingOne);
                $('.dashboard__pagination-two').text(btnPagingTwo);
                $('.dashboard__pagination-three').text(btnPagingThree);
                $('.dashboard__pagination-four').text(btnPagingFour);
            }
            console.log(pageNumber);
            loadData();
        }
    })
    $(".dashboard__pagination-next").click(function(){
        if(pageNumber<totalPage){
            pageNumber++;
            if(pageNumber%4==1)
            {
                btnPagingOne=Math.floor(pageNumber/4)*4 +1;
                btnPagingTwo=btnPagingOne+1;
                btnPagingThree=btnPagingTwo+1;
                btnPagingFour=btnPagingThree+1;
                $('.dashboard__pagination-one').text(btnPagingOne);
                $('.dashboard__pagination-two').text(btnPagingTwo);
                $('.dashboard__pagination-three').text(btnPagingThree);
                $('.dashboard__pagination-four').text(btnPagingFour);
            }
            console.log(pageNumber);
            loadData();
        }
    })
    $(".dashboard__pagination-first").click(function(){
       pageNumber=1;
       loadData();
    })
    $(".dashboard__pagination-last").click(function(){
        pageNumber=totalPage;
        loadData();
     })
    //Click vào số trang
    $(".btn__paging").click(function () {
        $(this).siblings().removeClass('dashboard__pagination-current');
        this.classList.add("dashboard__pagination-current");
    })
    

}
    //---------
    // Validate form
    $('input[required]').blur(function() {
        // Lấy ra value
        let value = this.value;
        // Kiểm tra value
        if (!value) {
            //Nếu value bằng null thì thêm cảnh báo lỗi
            $(this).addClass("input--error");
            $(this).attr('title', "Thông tin này không được phép để trống");
        } else {
            // Nếu có value thì bỏ cảnh báo lỗi:
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
            //Kiểm tra format email nếu input có type là email
            if(this.type==="email"){
                let valueEmail=$(this).val();
                if(!checkEmailFormat(valueEmail))
                {
                    $(this).addClass("input--error");
                    $(this).attr('title', "Vui lòng nhập đúng định dạng email!");
                } else 
                {
                    $(this).removeClass("input--error");
                    $(this).removeAttr('title');
                }
            }
        }
    })

    //Ngày chọn không lớn hiện tại
    $("input[type=date]").attr("max",formatDate2(Date.now()));
    


    //---------------
    //Rút gọn menu
    $(".dasboard__heading__icon").click(()=>{
        $(".dashboard__category-title").toggleClass("disable");
        $(".dasboard__heading__logo").toggleClass("disable");
        $(".dasboard__info__logo-center").toggleClass("disable");
    })
    //--------
    //Refresh lại dữ liệu
    $(".dashboard__filter-refresh").click(function(){
        $(".modal__anouncement--loading").show();
        setTimeout(()=>{
            loadData();
            employeeId=null;
            $(".modal__anouncement--loading").hide();
        },500)

    }
    )
    
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
        switch(data["WorkStatus"]){
            case "Đang thử việc":
                data["WorkStatus"]=1;
                break;
            case "Đang làm việc":
                data["WorkStatus"]=2;
                break;
            default:
                break;

        }  
        //Set value cho input 
        let inputs = $(".container__body-infor input, .container__body-infor select");
        for (const input of inputs) {
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
    //Xử lí nút Lưu
    $("#btnSave").click((event)=>{
        event.preventDefault();
        //Kiểm tra các input bắt buộc nhập
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
            //Hiện thông báo nhập các input bắt buộc
            $(".modal__anouncement--validate-form").show()
        }
    });

function saveData() {
    //Lấy value từ các input và select
    let inputs = $(".container__body-infor input, .container__body-infor select");
    let employee = {};
    console.log("Thông tin biến employee trước khi set");
    console.log(employee);
    //Lưu các giá trị của input tương ứng với propValue
    for (const input of inputs) {
        const propValue = $(input).attr("propValue");
        if (propValue) {
            let value = input.value;
            employee[propValue] = value;
        }
    
    }
    console.log("Thông tin Employee sau khi set");
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
                //Hiện thông báo chỉnh sửa thành công
                $(".modal__anouncement--edit").show()
                // Load lại dữ liệu
                loadData();
                // Ẩn form thông tin chi tiết
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
                //Hiện thông báo thêm thành công
                $(".modal__anouncement--add").show()
                // Load lại dữ liệu
                loadData();
                // Ẩn form thông tin chi tiết
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
        url: `https://cukcuk.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${searchEmployee}&positionId=${positionFilter}&departmentId=${departmentFilter}`,
        async: false,
        success: function (response) 
        {
            if(response)
            {
                totalPage=Math.ceil(response.TotalRecord/pageSize);//số lượng trang tối đa
                const data=response.Data;
                $("table tbody").empty();
                let sort = 1;
                let ths = $("table#data__EmployeeList thead th");
                for (const employee of data) 
                {
                    // Duyệt từng cột trong tiêu đề:
                    var trElement = $('<tr></tr>');
                    for (const th of ths) 
                    {
                        // Lấy ra propValue tương ứng với các cột
                        const propValue = $(th).attr("propValue");
    
                        const format = $(th).attr("format");
                        // Lấy giá trị tương ứng với tên của propValue trong đối tượng
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
                                value = formatMoney(value);
                                classAlign = "text-align-right";
                                break;
                            default:
                                break;
                        }
                        if(propValue==="WorkStatus"){
                            switch(value){
                                case 1:
                                    value="Đang thử việc";
                                    break;
                                case 2:
                                    value="Đang làm việc"
                                    break;
                                default:
                                    break;
                            }
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
            
            }
            else{
                $("table tbody").empty();
            }
    },
    error: function(res) {
        $("table tbody").empty();
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
function checkEmailFormat(email) {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}
