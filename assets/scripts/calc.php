<?php
    if(isset( $_POST['Calculate'])){
        $datepicker = $_POST['datepicker'];
        $input_sum = $_POST['input_sum'];
        $calculator_item_select = $_POST['calculator_item_select'];
        $checked = $_POST['checked'];
        $input_replenishment = $_POST['input_replenishment'];
        if($datepicker == ""){
            echo json_encode("Не введена дата");
        }
        elseif ($input_sum === "" || $input_sum < 1000 || $input_sum > 3000000){
            echo json_encode("Неправильно введена сумма вклада");
        }
        elseif ($checked == "true" && ($input_replenishment === "" || $input_replenishment < 1000 || $input_replenishment > 3000000)){
            echo json_encode("Неправильно введена сумма вклада");
        }
        elseif ($calculator_item_select < 1 && $calculator_item_select > 5){
            echo json_encode("Неверный скор вклада");
        }
        else{
            list($month, $day, $year) = split('[/.-]', $datepicker);
            $summn = $input_sum;
            $summadd = $checked == "true" ? $input_replenishment:0;
            $percent = 0.1;
            $daysy = 365 + ( $year % 4 == 0 );
            for ($i = 1; $i <= 12*$calculator_item_select; $i++) {
                $daysn = cal_days_in_month(CAL_GREGORIAN, $month, $year);
                $summn +=$summadd + ($summn+$summadd)*$daysn*($percent/$daysy);
                if ($month+1 > 12){
                    $month =  1;
                    $year++;
                    $daysy = 365 + ( $year % 4 == 0 );
                }else{
                    $month = $month+1;
                }
            }
            echo json_encode(round($summn));
        }
    }
?>