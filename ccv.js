var creditCardValidator = function(){
    //private variables
    _cardTypes = [
      {
        name: 'visa_electron',
        pattern: /^(4026|417500|4508|4844|491(3|7))/,
        validLength: [16]
      }, {
        name: 'visa',
        pattern: /^4/,
        validLength: [16]
      }, {
        name: 'mastercard',
        pattern: /^5[1-5]/,
        validLength: [16]
      }, {
        name: 'maestro',
        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
        validLength: [12, 13, 14, 15, 16, 17, 18, 19]
      }, {
        name: 'american_express',
        pattern: /^3[47]/,
        validLength: [15]
      }
    ];

    //private functions

    //  Version based on
    // https://gist.github.com/DiegoSalazar/4075533   
    function _isValidLuhn(value){     
         // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var nDigit = parseInt(value.charAt(n), 10);

            if (bEven && ((nDigit *= 2) > 9)) nDigit -= 9;

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0; 
    }

    function _isValidCardLength(num, type){
        return type.validLength.indexOf(num.length) > -1;
    }

    function _getTypeCard(num){
        var _k = 0, _cardType, done = false;

        while (_k < _cardTypes.length && !done) {
            if (num.match(_cardTypes[_k].pattern)){
                _cardType = _cardTypes[_k];
                done = true;
            }
            _k++;
        }
        return _cardType;
    }

    //public functions
    function cardNumberValidator(number){
        var num = number.toString(),
        _cardType = _getTypeCard(num);

        if (_cardType != null) {
          luhn_valid = _isValidLuhn(num);
          length_valid = _isValidCardLength(num, _cardType);
        }
         return (luhn_valid && length_valid) ? _cardType.name : null;

    }

    function cvvValidator(number, type){
        var str = number.toString(), isValid = false;
        //length should be 3, unless that it is american express, then it should be 4
        isValid = ((type == "american_express") && (str.length == 4)) || (str.length == 3);

        //we check that it is an integer
        return isValid &&  Math.round(number) === number;
    }

    //foreign names should be taken into account http://stackoverflow.com/questions/33948270/javascript-regex-for-foreign-names
    //So we check that it is not empty
    function nameValidator(name){
        return /([^\s])/.test(name);
    }

    return {
      nameValidator: nameValidator,
      cvvValidator: cvvValidator,
      cardNumberValidator: cardNumberValidator
    }
}();
