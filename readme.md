# Useful Validator &#x1F34E;

```diff
+ Short Documentation
```

:rice: Requirement :
- no need third party library

:eyes: Usage :
- You can use this library to validate your input or submit button. Also you can create your own rule with regex tho ! This library can use both for Class and Functional component in React JS.

:bento: Functions you must to know :
## ValidatorMessage

It's an JSX which show your validation message with red font color as default. Basically it will show when your input is not matching with the rule.

there are some props inside it :
1. **disableEmptyCheck**

     Disable validating if value is null or empty. You can use this if you have more than one ValidatorMessage, so it willnot show on the first time or when input is empty.

2. **message**

     The default message is "Please fill the blank". But, you can put your own validation message with this props

3. **special**

     Write rule or regex to validate your input with this props. Or you can leave it empty if you just want to validate null/empty input. 

     **IMPORTANT :**
if you use regex, and it has a backslash \ or any other special character, write it twice

 4. **className**

     Put your CSS className for message text

 5. **display**

     Use this for controls display/hide the ValidationMessage. Usually when you want the ValidationMessage function works after user hit submit button. We call this "late validator".


## lateValidator

It's a function that you will use only on class component. This function allows you to control the ValidatorMessage to hide/show. here are the constructor function :

1. **hide**

     Allows you to hide the ValidatorMessage

2. **show**

     Allows you to hide the ValidatorMessage

## forceUpdate

Use this just in case you want to show the ValidatorMessage after click a button. Because in Class Component, it needs a re-render to change boolean state

## useLateValidator

It's a function that you will use only on functional component. Basically this is an useState. But we simplify so you wont repeatedly create useState. This function allows you to control the ValidatorMessage to hide/show. here are the return variables :

1. **set**

     Allows you set boolean value to for ValidatorMessage (show variable)

2. **show**

     Value that will consumed by ValidatorMessage to show/hide

## ValidatorExecute

this is a function that you will use to validate value. When some values are not following the rule. it will return false. here are the parameters :

1. **values**

     Collect your values here to validate

2. **special**

     Put your rules here so the ValidatorExecute will return true when values follows the rules. Leave it blank if you just wanted to validate the value is exist or not. ValidatorExecute defaultly not allowed empty string, null and undefined value.

     **IMPORTANT** : values and special must inside an array ! even onlu one value

:paperclip: Example :

# ValidatorMessage

1. Show on the first time with custom message (quickly show message when page rendered)

```js
<ValidatorMessage className="text-align-left" value={yourValue} message="You must fill this blank" />
```

2. Show with useLateValidator(functional component)

```js
<ValidatorMessage display={validator.show} className="text-align-left" value={yourValue} />
```

3. Show with lateValidator(class component)
```js
<ValidatorMessage display={validator} className="text-align-left" value={yourValue} />
```

4. Show with disableEmptyCheck(class component)
```js
<ValidatorMessage disableEmptyCheck className="text-align-left" value={yourValue} />
```

4. Show with special
rule in example means : minimal input length is 10 of string
```js
<ValidatorMessage disableEmptyCheck className="text-align-left" value={yourValue} special='type:string|min:10' />
```

# useLateValidator (full example)

You can decide to show ValidatorMessage or not. but we show the full example here.

```js
import react from 'react'
import { useLateValidator } from '../yourdirectory/yourfolder/validator';

function yourFunctionalComponent() {
     const [username, setUsername] = useState("");
     let display = useLateValidator()

     const handleButtonSubmit = () => {
          let execute = ValidatorExecute({values: [username]})
          if(execute){
               display = display.set(true)
          }else{
               display = display.set(false)
          }
     }

     return(
          <div>
               <input onChange={(e) => setUsername(e.target.value)} value={username} ></input>
               <ValidatorMessage display={display.show} className="text-align-left" value={username} />
               <button onClick={() => handleButtonSubmit()}>Submit</button>
          </div>
     )
}
```

# lateValidator (full example)

You can decide to show ValidatorMessage or not. but we show the full example here.

```js
import React, { Component } from 'react'
import { lateValidator } from '../yourdirectory/yourfolder/validator';

export class YourClass extends Component {
constructor(props) {
  super(props)
  this.validator = lateValidator.hide

  this.state = {
     username: ''
  }
}

handleButtonSubmit = () => {
     let execute = ValidatorExecute({values: [this.state.username]})

     if(execute){
          this.validator = lateValidator.show
     }else{
          this.validator = lateValidator.hide
     }

     this.forceUpdate()

}

  render() {
    return (
      <div>
          <input onChange={(e) => setState({username: e.target.value})} value={username} ></input>
          <ValidatorMessage display={this.validator} className="text-align-left" value={username} />
          <button onClick={() => handleButtonSubmit()}>Submit</button>
      </div>
    )
  }
}

export default YourClass
```

# Things about **special** params

This library already provide you some basic validator, they are type, max and min. Type contains string and number.

 Write special with | separator if you have multiple rules. You can use special rule validation like only number, only string and regex. Here is how to write the special rule :

> ValidatorExecute

in ValidatorExecute, you must identify the index number of the specific value in the "values" array. For example :

```js
let execute = ValidatorExecute({values: [username, password], special: ['1|type:number|max:20']})
```

special above means you must input password value with number with length not more than 20. Otherwise, ValidatorExecute will return false. And the ValidatorExecute will return true for username value if is not blank.

**With regex**

```js
let execute = ValidatorExecute({values: [username, password], special: ['0|regex:/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/']})
```

 We recommend to test the regex first on the internet to minimalize error.
 Special above mens you must input username including @ character, and don't duplicate (email's regex). also write backslash \ twice because it's an special character
 
 ValidatorMessage

You could write the rule like in the ValidatorExecute but without put it inside of an array and absolutely without array index.

 ```js
 <ValidatorMessage value={secondValue} message="not allowed" special='min:10|regex:/^08[0-9]{8,}$/' />
 ```

 # Things about **switchEngine** (for adding personal rule)

 You can write your own rule for validate value using switchEngine. 

 here's the switchEngine code :

 ```js
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
 ```

 The only thing you have to do is just add new option to switchcase of the switchEngine, then write down your own rule function below it. The case name is the name for identify your rule. For example our default rule "max:12", so the case name is max.

