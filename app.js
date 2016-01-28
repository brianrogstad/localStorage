(function() {
    'use strict';

    var URL = '#';
    var companiesArray = [];

    function init(){
        createCompany('APPL', 34);
        createCompany('GOOG', 31);
        createCompany('IBM', 4);
        createCompany('PEP', 7);
    }

    function sortArray() {
        companiesArray.sort(function (a,b){
            if (a.value < b.value){
                return 1;
            }
            if (a.value > b.value){
                return -1;
            }
            return 0;
        });
    }

    $(window).load(function () {
        if (localStorage.length === 0) {
            init();
        } else {
            getData();
        }
    });

    function getData() {
        $.get(URL, function (data){
            var storedCompanies = localStorage.getItem('companies');
            data = JSON.parse(storedCompanies);
            companiesArray = data;
            sortArray();
        }).done(function(){
            buildTable(companiesArray);
        });
    }

    $('#submit').click(function() {
        var inputName = $('#name').val();
        var inputValue = $('#value').val();

        $.ajax({
            url: URL,
            dataType: 'text',
            success: function(data, textStatus) {
                if (textStatus == 'success') {
                    var isNotFoundInArray = function (element) {
                        return element.name !== inputName;
                    };
                    if(companiesArray.every(isNotFoundInArray)){
                        createCompany(inputName, inputValue);
                        sortArray();
                        window.location.reload();
                    } else {
                        for (var i = 0; i < companiesArray.length; i++) {
                            if (companiesArray[i].name === inputName) {
                                addToCompany(inputName, inputValue);
                                break;
                            }
                        }
                    }
                }
            }
        });

        $('#name').val('');
        $('#value').val('');
        return false;
    });

    function addToCompany(name, value) {
        for (var i = 0; i < companiesArray.length; i++) {
            if (companiesArray[i].name === name) {
                companiesArray[i].value = parseFloat(companiesArray[i].value) + parseFloat(value);
                break;
            }
        }
        sortArray();
        localStorage.setItem('companies', JSON.stringify(companiesArray));
        window.location.reload();
    }

    var Company = function(name, value) {
        this.name = name;
        this.value = value;
    };

    function createCompany(name, value) {
        var company = new Company(name, value);
        companiesArray.push(company);
        buildTableRow(company);
        localStorage.setItem('companies', JSON.stringify(companiesArray));
    }

    function buildTableRow(rowData) {
        var row = $('<tr />');
        $('.table tbody').append(row);
        row.append($('<td>' + rowData.name + '</td>'));
        row.append($('<td>' + rowData.value + '</td>'));
    }

    function buildTable(data) {
        for (var i = 0; i < data.length; i++) {
            buildTableRow(data[i]);
        }
    }

}());