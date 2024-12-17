import 'normalize.css';
import './styles/main.scss';
import './styles/fonts.scss';
import './styles/table.scss';
import './styles/mobile.scss';

import baloonSvg from './images/baloon.svg';

//Валидация формы
class FormsValidation {
    selectors = {
        form: '[data-js-form]',
        fieldErrors: '[data-js-form-field-errors]',
    }

    errorMessages = {
        valueMissing: ({ title }) => title || 'Пожалуйста, заполните это поле',
        patternMismatch: ({ title }) => title || 'Данные не соответствуют формату',
        tooLong: ({ title }) => title || 'Слишком длинное значение',
        tooShort: ({ title }) => title || 'Слишком короткое значение',
    }

    constructor() {
        this.bindEvents()
    }

    manageErrors(fieldControlEllement, errorMessages) {
        const fieldErrorEllement = document.getElementById(`${fieldControlEllement.name}-errors`);

        fieldErrorEllement.innerHTML = errorMessages
        .map((message) => `<span class="field__error">${message}</span>`)
        .join('');
    }

    validateField(inputElement) {
        const errors = inputElement.validity;
        const errorMessages = []

        Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
            if (errors[errorType]) {
                errorMessages.push(getErrorMessage(inputElement))
            }
        })

        this.manageErrors(inputElement, errorMessages);

        const isValid = errorMessages.length === 0;

        inputElement.ariaInvalid = !isValid;
        
        return isValid;
    }

    onBlur(event) {
        const { target } = event;
        const isFormField = target.closest(this.selectors.form);
        const isRequired = target.required;

        if (isFormField && isRequired) {
            this.validateField(target)
        }
    }

    onChange(event) {
        const { target } = event;
        const isRequired = target.required;
        const isToggleType = ['radio', 'checkbox'].includes(target.type);

        if (isRequired && isToggleType) {
            this.validateField(target)
        }
    }

    onSubmit(event) {
        const isFormElement = event.target.matches(this.selectors.form);

        if (!isFormElement) {
            return
        }

        const requiredControlElements = [...event.target.elements].filter(({required}) => required);

        let isFormValid = true;
        let firstInvalidFieldComtrol = null;

        requiredControlElements.forEach((element) => {
            const isFieldValid = this.validateField(element);

            if (!isFieldValid) {
                isFormValid = false;

                if (!firstInvalidFieldComtrol) {
                    firstInvalidFieldComtrol = element;
                    firstInvalidFieldComtrol.focus();
                }
            }
        })

        if (!isFormValid) {
            event.preventDefault();
        }
    }

    bindEvents() {
        document.addEventListener('blur', (event) => {
            this.onBlur(event)
        }, {capture: true});
        document.addEventListener('change', (event) => {
            this.onChange(event)
        });
        document.addEventListener('submit', (event) => {
            this.onSubmit(event)
        });
    }
}

new FormsValidation();

ymaps.ready(init);

function init() {
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64], 
        zoom: 5, 
        controls: [] 
    });

    const orlPlacemark = new ymaps.Placemark([52.9606, 36.0773], {
        balloonContent: 'Орёл'
    }, {
        iconLayout: 'default#image',
        iconImageHref: baloonSvg,
        iconImageSize: [30, 42],
        iconImageOffset: [-15, -42]
    });

    const ryazanPlacemark = new ymaps.Placemark([54.6079, 39.7379], {
        balloonContent: 'Рязань'
    }, {
        iconLayout: 'default#image',
        iconImageHref: baloonSvg,
        iconImageSize: [30, 42],
        iconImageOffset: [-15, -42]
    });


    const samaraPlacemark = new ymaps.Placemark([53.2002, 50.15], { 
        balloonContent: 'Самара'
    }, {
        iconLayout: 'default#image',
        iconImageHref: baloonSvg,
        iconImageSize: [30, 42],
        iconImageOffset: [-15, -42]
    });

    const kazanPlacemark = new ymaps.Placemark([55.8304, 49.0661], {
        balloonContent: 'Казань'
    }, {
        iconLayout: 'default#image',
        iconImageHref: baloonSvg,
        iconImageSize: [30, 42],
        iconImageOffset: [-15, -42]
    });

    const kostanayPlacemark = new ymaps.Placemark([53.2150, 63.6260], {
        balloonContent: 'Костанай'
    }, {
        iconLayout: 'default#image',
        iconImageHref: baloonSvg,
        iconImageSize: [30, 42],
        iconImageOffset: [-15, -42]
    });


    myMap.geoObjects.add(orlPlacemark);
    myMap.geoObjects.add(ryazanPlacemark);
    myMap.geoObjects.add(samaraPlacemark); 
    myMap.geoObjects.add(kazanPlacemark);
    myMap.geoObjects.add(kostanayPlacemark); 

    myMap.setBounds(myMap.geoObjects.getBounds());


    myMap.behaviors.disable('scrollZoom');
    myMap.behaviors.disable('drag');

    myMap.controls.remove('geolocationControl');
    myMap.controls.remove('searchControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('fullscreenControl');
    myMap.controls.remove('zoomControl');
    myMap.controls.remove('rulerControl');
}

document.addEventListener('DOMContentLoaded', function () {
    const telInputs = document.querySelectorAll('.questions__tel');

    telInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            // Удаляем все символы, кроме цифр
            let value = this.value.replace(/\D/g, '');

            // Если значение меньше 1, просто очищаем поле
            if (value.length < 1) {
                this.value = '';
                return;
            }

            // Форматируем номер в нужный формат
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue += value[0]; // X
            }
            if (value.length > 1) {
                formattedValue += '(' + value.substring(1, 4); // (XXX
            }
            if (value.length >= 4) {
                formattedValue += ')' + value.substring(4, 7); // )XXX
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, 9); // -XX
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, 11); // -XX
            }

            this.value = formattedValue;
        });
    });
});