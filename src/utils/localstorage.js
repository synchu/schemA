export const localStorageExists = () => {
  try {
    localStorage.setItem('playblu_test', 'test')
    return 1
  } catch (e) {
    console.log(e)
    return null
    }
}