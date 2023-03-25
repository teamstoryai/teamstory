import { logger } from '@/utils/logger'
import { isMac } from '@/utils/os'

/** join class names */
export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** make initials from name */
export function makeInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

export const pluralizeWithCount = (noun: string, num: number) => {
  return num + ' ' + pluralize(noun, num)
}

// from https://stackoverflow.com/questions/27194359/javascript-pluralize-an-english-string
export function pluralize(word: string, amount?: number): string {
  if (amount !== undefined && amount === 1) {
    return word
  }
  const plural: { [key: string]: string } = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    sis$: 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s',
  }
  const irregular: { [key: string]: string } = {
    move: 'moves',
    foot: 'feet',
    goose: 'geese',
    sex: 'sexes',
    child: 'children',
    man: 'men',
    tooth: 'teeth',
    person: 'people',
  }
  const uncountable: string[] = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment',
    'bison',
    'cod',
    'offspring',
    'pike',
    'salmon',
    'shrimp',
    'swine',
    'trout',
    'aircraft',
    'hovercraft',
    'spacecraft',
    'sugar',
    'tuna',
    'you',
    'wood',
  ]
  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(word.toLowerCase()) >= 0) {
    return word
  }
  // check for irregular forms
  for (const w in irregular) {
    const pattern = new RegExp(`${w}$`, 'i')
    const replace = irregular[w]
    if (pattern.test(word)) {
      return word.replace(pattern, replace)
    }
  }
  // check for matches using regular expressions
  for (const reg in plural) {
    const pattern = new RegExp(reg, 'i')
    if (pattern.test(word)) {
      return word.replace(pattern, plural[reg])
    }
  }
  return word
}

/** unwrap backend errors */
export function unwrapError(error: any, skipExpandErrors?: boolean, defaultMessage?: string) {
  if (!error) return 'Error'
  if (typeof error == 'string') return error
  if (error.response) {
    let response = error.response
    if (response.data) logger.info(response.data)

    const errorObject = response.data.error
    if (errorObject) {
      const message =
        errorObject.message == 'Invalid parameters were provided'
          ? 'Data was not valid'
          : typeof errorObject.message == 'string'
          ? errorObject.message
          : JSON.stringify(errorObject.message)
      const otherKeys = Object.keys(response.data.error).filter(
        (k) => k != 'message' && k != 'resend'
      )
      if (message && !skipExpandErrors && otherKeys.length > 0) {
        return (
          message +
          ': ' +
          otherKeys
            .map(
              (k) =>
                `${k} ${
                  Array.isArray(response.data.error[k])
                    ? response.data.error[k].join(', ')
                    : JSON.stringify(response.data.error[k])
                }`
            )
            .join(', ')
        )
      } else {
        return message
      }
    } else {
      return defaultMessage
    }
  } else if (error.message) {
    return error.message
  } else {
    return defaultMessage
  }
}

const SHORTWORDS =
  /^(and|as|but|for|if|nor|or|so|yet|a|an|the|as|at|by|for|in|of|off|on|per|to|up|via)$/i

/** for titles */
export function toTitleCase(str: string, delim?: string) {
  const title = str.replace(/\w\S*/g, function (txt) {
    if (txt.match(SHORTWORDS)) {
      return txt.toLowerCase()
    } else {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  })
  return title.charAt(0).toUpperCase() + title.substr(1)
}

export function ctrlOrCommand() {
  return isMac ? '⌘' : 'ctrl'
}

export const timeToString = (seconds: number) => {
  let minutes = Math.floor(seconds / 60)
  let remain = Math.floor(seconds - minutes * 60)
  return `${minutes}:${remain < 10 ? '0' : ''}${remain}`
}
