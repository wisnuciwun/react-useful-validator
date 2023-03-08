import React, { useState } from 'react'
import './validator-style.css'

/**
 * 
 * @typedef PropTypesArrayValidatorExecute 
 * @property { any[] } values - Insert all values which want to validate inside an array
 * @property { string } rules - Use your special validator like max length and/or regex, first by writing it's index of the value. example '1|max:9. if you use backslash \ on regex or any special character, write it twice'
 */

/**
 * ArrayValidatorExecute use for validating values and submit button. 
 * When several value inside the array is not following the rules, message will appear (if you using ValidatorMessage) and ArrayValidatorExecute will return false.
 * The full usage example is on validator.js, then scroll to end
 * use ValidatorMessage if you need to show alert message under the input
 * You can add your own rule on switchEngine function (you can add your own rule there)
 * useLateValidator if you want to show ValidatorMessage appear when user click submit button
 * @param { PropTypesArrayValidatorExecute } values
 * @param { PropTypesArrayValidatorExecute } rules
 */

export function ArrayValidatorExecute({ values = [], rules = [] }) {
     let execute = ''
     if (values.length != 0) {
          execute = values.every(val => val != '')

          if (rules.length != 0) {
               let newRule = []
               rules.forEach(val => {
                    let splitRule = val.split('|')
                    let valueIndex = rules[0]
                    splitRule.shift()
                    splitRule.forEach(opt => {
                         let rule = opt.split(':')
                         switchEngine(rule[0], values[valueIndex], rule[1], newRule)
                    })
               })

               if (newRule.every(val => val == true) && execute) {
                    execute = true
               }
               else {
                    execute = false
               }

               newRule.length = 0
          }
     }

     return execute
}

/**
 * 
 * @typedef PropTypeFunctionalLateValidator
 * @property { boolean } value - Put your boolean here to control the ValidatorMessage display. true ==> show message and false ==> hide message
 */

/**
 * Use this for control show/hide a ValidatorMessage. Usually we needs to show validation after user hit submit button.
 * Use this only in Functional component
 * @param { PropTypeFunctionalLateValidator } value
 */

export function useLateValidator(value = false){
     const [show, setshow] = useState(value)
     return {show: show, set: setshow}
}

/**
 * 
 * @typedef PropTypeLateValidator 
 * @property { boolean } hide - control validator to hide ValidatorMessage
 * @property { boolean } show - control validator to show ValidatorMessage
*/

/**
 * Use this for controlling ValidatorMessage to hide or show. Usually we needs to show validation after user hit submit button.
 * Use this only in Class component
 * @param { PropTypeLateValidator } hide
 * @param { PropTypeLateValidator } show
 */

export function Late () {
     this.hide = false
     this.show = true
 }
 
 export const lateValidator = new Late();
 
 Late.prototype.hide = function() {
     return this.hide
 }

 Late.prototype.show = function() {
     return this.show

     
 }

/**
 * 
 * @typedef PropTypeMessage 
 * @property { ? } value - You should write the value
 * @property { boolean } disableEmptyCheck - Disable validating if value is null or empty. Use this if you have more than one ValidatorMessage
 * @property { string } message - Write your validator message
 * @property { string } rules - Write your rule or regex to validate your input. if you use backslash \ on regex or any special character, write it twice
 * @property { string } className - Use your own CSS className
 * @property { boolean } display - Use this if you implement useLateValidator to hide your ValidatorMessage until user hit submit Button
 */

/**
 * Place ValidatorMessage below your input
 * @param { PropTypeMessage } value
 * @param { PropTypeMessage } disableEmptyCheck
 * @param { PropTypeMessage } message
 * @param { PropTypeMessage } rules
 * @param { PropTypeMessage } className
 * @param { PropTypeMessage } display
 *  */

export function ValidatorMessage({ value = '', disableEmptyCheck = false, message = 'Please fill the blank', rules = [], className = {}, display = true, ...rest }) {
     let execute = ''

     if (value != '' && value != undefined && value != null) {
          execute = true
     }
     else {
          execute = false
     }

     if (rules.length != 0) {
          let newRule = []
          let splitRules = rules.split('|')
          splitRules.forEach(opt => {
               let rule = opt.split(':')
               switchEngine(rule[0], value, rule[1], newRule)
          })

          if (newRule.every(val => val == true) && execute) {
               execute = true
          }
          else {
               execute = false
          }

          newRule.length = 0
     }

     if ((value == '' || value == undefined || value == null) && disableEmptyCheck == true) {
          return null
     }
     else if (!execute && display == true) {
          return (
               <div className={`validator-msg ${className}`} {...rest} >{message}</div>
          )
     }
     else {
          return null
     }     
}

/**
 * 
 * @typedef PropTypesValidatorBoolean 
 * @property { any[] } value - Insert value which want to validate
 * @property { string } rule - Use your special validator like max length and/or regex, first by writing it's index of the value. example '1|max:9. if you use backslash \ on regex or any special character, write it twice'
 * @property { boolean } disableEmptyCheck - Set the disampeEmptyCheck to true if you want to skip validating when value is empty
 */

/**
 * ValidatorBoolean use for validating a single value. 
 * When value is not following the rules, ValidatorBoolean will return false.
 * The full usage example is on validator.js, then scroll to end
 * @param { PropTypesValidatorBoolean } value
 * @param { PropTypesValidatorBoolean } rule
 * @param { PropTypesValidatorBoolean } disableEmptyCheck
 */

export function ValidatorBoolean({value = '', rule = '', disableEmptyCheck = true}) {
     let valid = ''

     if (value != '' && value != undefined && value != null) {
          valid = true
     }
     else {
          valid = false
     }

     if (rule.length != 0) {
          let newRule = []
          let rules = rule.split('|')
          rules.forEach(opt => {
               let finalRule = opt.split(':')
               switchEngine(finalRule[0], value, finalRule[1], newRule)
          })

          if (newRule.every(val => val == true) && valid) {
               valid = true
          }
          else {
               valid = false
          }

          newRule.length = 0
     }
     
     if ((value == '' || value == undefined || value == null) && disableEmptyCheck) {
          return true
     }
     else {
          return valid
     }     
}


function switchEngine(checkermodule, value, rule, newRule){
     switch (checkermodule) {
          case 'max':
               newRule.push(maxCheck(value, rule))
               break;
          case 'min':
               newRule.push(minCheck(value, rule))
               break;
          case 'type':
               newRule.push(typeCheck(value, rule))
               break;
          case 'regex':
               newRule.push(regexCheck(value, rule))

          default:
     }
}

function regexCheck(value = '', rule = /e/){
     var match = rule.match(new RegExp('^/(.*?)/([gimy]*)$'));
     var regex = new RegExp(match[1], match[2]);
     if(regex.test(value)) {
          return true
     }
     else {
          return false
     }
}

function typeCheck(value = '', type) {
     let res = ''

     switch (type) {
          case 'number':
               if (Number(value).toString() == 'NaN') {
                    res = false
               }
               else {
                    return true
               }
               break;

          case 'string':
               if (typeof value == type) {
                    res = true
               }
               else {
                    res = false
               }
               break;

          default:
               break;
     }

     return res
}

function minCheck(value = '', length) {
     let res = ''
     if (value?.length >= length && value != null) {
          res = true
     }
     else {
          res = false
     }
     return res
}

function maxCheck(value = '', length) {
     let res = ''
     if (value?.length <= length && value != null) {
          res = true
     }
     else {
          res = false
     }
     return res
}

// *** Examples ***

const exampleArrayValidatorExecute = () => {
     // ValidatorExecute({ values: [data.name, data.handphone, data.province, data.city, data.district, data.zipcode?.postal_code, data.address], rules: ['1|min:11|type:number', '6|min:14'] })
}

const exampleValidatorBoolean = () => {
     // ValidatorBoolean(
     //      data.password,
     //      "type:string",
     //      false
     //    )
}

const exampeValidatorMessage = () => {
     // let validator = useLateValidator() // if you want to useLateValidator
     // const submitButton = () => {
     //      validator.set(true) // set to true after submit button clicked
     // }
     // <ValidatorMessage style={{marginTop: '-10px'}} value={data.address} message="Please fill address field" rules='min:14' display={validator.show} />
}