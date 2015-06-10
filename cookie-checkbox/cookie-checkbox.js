var cookieCheckboxCookiePrefix = 'cookie-checkbox-';

var setCookieCheckboxValues = function (key, values) {
    var cookieName = cookieCheckboxCookiePrefix + key;
    if (values != null && values != "null") {
        $.cookie(cookieName, JSON.stringify(values));
    } else {
        $.cookie(cookieName, null);
    }
}

var getCookieCheckboxValues = function (cookieCheckboxKey) {
    var cookieName = cookieCheckboxCookiePrefix + cookieCheckboxKey;

    var cookieValues = $.cookie(cookieName);

    if (cookieValues == null || cookieValues == "null") {
        cookieValues = new Array();
    } else {
        cookieValues = $.parseJSON(cookieValues);
    }

    return cookieValues;
}

var cookieCheckboxToCookie = function (checkboxElement) {
    var checkedValue = $(checkboxElement).attr('data-cookie-checkbox-value');

    var cookieCheckboxKey = $(checkboxElement).attr('data-cookie-checkbox-key');
    var cookieValues = getCookieCheckboxValues(cookieCheckboxKey);

    var index = cookieValues.indexOf(checkedValue);

    if ($(checkboxElement)[0].checked) {
        if (index < 0) {
            cookieValues.push(checkedValue);
        }
    } else {
        while (index > -1) {
            cookieValues.splice(index, 1);
            index = cookieValues.indexOf(checkedValue);
        }
    }
    setCookieCheckboxValues(cookieCheckboxKey, cookieValues);
}

var cookieToCookieCheckbox = function () {
    $('input[type=checkbox]').each(function () {
        if ($(this).attr('data-cookie-checkbox-key') != null) {
            $(this)[0].checked = false;
            var cookieCheckboxKey = $(this).attr('data-cookie-checkbox-key');
            var cookieValues = getCookieCheckboxValues(cookieCheckboxKey);

            $.each(cookieValues, function (index, checkedValue) {
                $('input[type=checkbox]').each(function () {
                    if ($(this).attr('data-cookie-checkbox-key') == cookieCheckboxKey) {
                        if ($(this).attr('data-cookie-checkbox-value') == checkedValue) {
                            $(this)[0].checked = true;
                        }
                    }
                });
            });
        }

    });
}

var clearCookieCheckBox = function (cookieCheckboxKey) {
    setCookieCheckboxValues(cookieCheckboxKey, null);
    cookieToCookieCheckbox();
}

var setCookieCheckboxChangeEvent = function () {
    if ($(this).data('cookie-checkbox-check-all') == true) {
        var targetCheckboxKey = $(this).attr('data-cookie-checkbox-key');
        var checked = $(this)[0].checked;
        $(document).find('input[type=checkbox]').each(function () {
            if ($(this).data('cookie-checkbox') == true && $(this).attr('data-cookie-checkbox-key') == targetCheckboxKey) {
                $(this)[0].checked = checked;
                cookieCheckboxToCookie($(this));
            }
        });
    }

    if ($(this).data('cookie-checkbox') == true) {
        cookieCheckboxToCookie($(this));
    }
}
var enableCookieCheckBox = function () {
    $(document).off('change', 'input[type=checkbox]', setCookieCheckboxChangeEvent);
    $(document).on('change', 'input[type=checkbox]', setCookieCheckboxChangeEvent);

    cookieToCookieCheckbox();
}