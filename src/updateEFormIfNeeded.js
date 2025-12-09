export default function updateEFormIfNeeded (node, nodeNameValue) {
  if (!node.closest) {
    return
  }
  const form = node.closest('form')
  if (form && form.hasAttribute('data-e-form')) {
    const isNodeFormElement =
      nodeNameValue === 'input' ||
      nodeNameValue === 'select' ||
      nodeNameValue === 'option' ||
      nodeNameValue === 'textarea' ||
      nodeNameValue === 'e-local-storage-value' ||
      nodeNameValue === 'e-session-storage-value' ||
      nodeNameValue === 'e-form-dynamic-value' ||
      nodeNameValue === 'e-form-array' ||
      nodeNameValue === 'e-form-object'
    if (isNodeFormElement && typeof form.updateForm === 'function') {
      form.updateForm(form)
    }
  }
}
