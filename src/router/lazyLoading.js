export default (name, index = false) => () => {
  return import(`../components/${name}${index ? '/index' : ''}.vue`)
}
