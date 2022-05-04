import React, { useState } from 'react'
import './validator-style.css'

/**
 * 
 * @typedef PropTypes 
 * @property { any[] } values - Insert all values which want to validate inside an array
 * @property { string } special - Use your special validator like max length and/or regex, first by writing it's index of the value. example '1|max:9. if you use backslash \ on regex or any special character, write it twice'
 */

/**
 * This is a custom Tokdis' m-web overpowered validator. This validator use for validating input and submit button. 
 * When user is not following the rules, message will appear (if you using ValidatorMessage) and ValidatorExecute will return false.
 * The full usage example is in SectionSelectAddress.jsx and RegisterPremium.jsx file
 * use ValidatorMessage if you need to show alert message under the input
 * use ValidatorExecute if you need to validating submit button.
 * a ValidatorExecute usage is a must. Because Validator Message is just showing message and not validating the submit button if you have it.
 * You can add your own rule on switchEngine function (hope you contribute)
 * useLateValidator if you want to show ValidatorMessage appear when user click submit button
 * @param { PropTypes } values
 * @param { PropTypes } special
 */

export function ValidatorExecute({ values = [], special = [] }) {
     let execute = ''
     if (values.length != 0) {
          execute = values.every(val => val != '')

          if (special.length != 0) {
               let newRule = []
               special.forEach(val => {
                    let rules = val.split('|')
                    let valueIndex = rules[0]
                    rules.shift()
                    rules.forEach(opt => {
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
 * Use this for show ValidatorMessage after user click submit button
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
 * create new constructor in your
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
 * @property { string } special - Write your rule or regex to validate your input. if you use backslash \ on regex or any special character, write it twice
 * @property { string } className - Use your own CSS className
 * @property { boolean } display - Use this if you implement useLateValidator to hide your ValidatorMessage until user hit submit Button
 */

/**
 * Place ValidatorMessage below your input
 * @param { PropTypeMessage } value
 * @param { PropTypeMessage } disableEmptyCheck
 * @param { PropTypeMessage } message
 * @param { PropTypeMessage } special
 * @param { PropTypeMessage } className
 * @param { PropTypeMessage } display
 *  */

export function ValidatorMessage({ value = '', disableEmptyCheck = false, message = 'Please fill the blank', special = [], className = {}, display = true, ...rest }) {
     let execute = ''

     if (value != '' && value != undefined && value != null) {
          execute = true
     }
     else {
          execute = false
     }

     if (special.length != 0) {
          let newRule = []
          let rules = special.split('|')
          rules.forEach(opt => {
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
     if (value.length > length) {
          res = true
     }
     else {
          res = false
     }
     return res
}

function maxCheck(value = '', length) {
     let res = ''
     if (value.length < length) {
          res = true
     }
     else {
          res = false
     }
     return res
}