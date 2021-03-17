$( function() {
    // Календарь
    $( "#datepicker" ).datepicker({ dateFormat: 'dd/mm/yy' });
    $( "#datepicker" ).mask('99/99/9999');

    //Динамическое использование ползунка
    const
        range_sum = document.querySelector('#range_sum'),
        input_sum = document.querySelector('#input_sum'),
        input_replenishment = document.querySelector('#input_replenishment'),
        range_replenishment = document.querySelector('#range_replenishment');
    range_sum.oninput = () => input_sum.value = range_sum.value;
    input_sum.oninput = () => range_sum.value = input_sum.value;
    range_replenishment.oninput = () => input_replenishment.value = range_replenishment.value;
    input_replenishment.oninput = () => range_replenishment.value = input_replenishment.value;


    var error_title = $(".error_title");
    error_title.hide();

    /**
     * Выводит ошибку на экран
     *
     * @this  {SendError}
     * @param {string} error - текст ошибки.
     */
    function SendError(error) {
        error_title.show();
        error_title.text("Ошибка: "+error+".");
    }

    //Обработка нажатия кнопки "Рассчитать"
    $(".calculator_result_button").on("click", function(event) {
        event.preventDefault();
        var datepicker = $("#datepicker").val();
        var input_sum = parseInt($("#input_sum").val());
        var calculator_item_select = $("#calculator_item_select")[0].selectedIndex+1;
        var checked = getChecked();
        var input_replenishment = parseInt($("#input_replenishment").val());
        //Обработка значений на стороне клиента
        if(datepicker === ""){
            SendError("Не введена дата");
            return false
        }
        if(input_sum === "" || input_sum < 1000 || input_sum > 3000000){
            SendError("Неправильно введена сумма вклада");
            return false
        }
        if (checked)
            if(input_replenishment === "" || input_replenishment < 1000 || input_replenishment > 3000000){
                SendError("Неправильно введена сумма пополнения");
                return false
            }
        if (calculator_item_select < 1 && calculator_item_select > 5){
            SendError("Неверный скор вклада");
            return false
        }
        error_title.hide();
        //Отпрашка POST запроса на сервер
        var data = new FormData();
        data.append( 'Calculate', true );
        data.append( 'datepicker', datepicker );
        data.append( 'input_sum', input_sum );
        data.append( 'calculator_item_select', calculator_item_select );
        data.append( 'checked', checked );
        data.append( 'input_replenishment', input_replenishment );
        $.ajax({
            url         : 'assets/scripts/calc.php',
            type        : 'POST',
            data        : data,
            cache       : false,
            dataType    : 'json',
            processData : false,
            contentType : false,
            success     : function( respond, status, jqXHR ){
                if( typeof respond.error === 'undefined' ){
                    //Вывод полученного результата на сайт
                    if (!isNaN(respond))
                        $(".calculator_result_sum").text(respond + " руб");
                    else
                        SendError(respond);
                }
                else {
                    SendError("Возникла неизвестная ошибка");
                }
            },
            error: function( jqXHR, status, errorThrown ){
                SendError("Возникла неизвестная ошибка");
            }

        });
    });

    //Обработка нажатия на меню в режиме планшета и телефона
    $("#menu_button").on("click", function(event) {
        event.preventDefault();

        $(this).toggleClass("active");
        $(".menu_inner").toggleClass("active");
    });

    /**
     * Возвращает булевое значение "пополнение счета"
     *
     * @this  {getChecked}
     * @return {boolean} значение положения radio.
     */
    function getChecked() {
        return !$("#no").is(':checked');
    }
} );