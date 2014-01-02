describe('SrBuj changeDom function', function(){
  beforeEach(function(){
    document.body = document.createElement('body')
    html = '<div><span id="proof"></span></div>'
    document.body.innerHTML = html

    proof_element = document.getElementById('proof')
  })

  it('should find version', function(){
      expect($.SrBuj.version).toBe('0.9.2')
  })

  it('should delete target', function(){
    $.SrBuj.changeDom('DELETE', $(proof_element))
    expect(document.getElementById('proof')).toBeNull()
  })

  it('should replace target', function(){
    expect(document.body.innerHTML).not.toContain('replaced')

    $.SrBuj.changeDom('PATCH', $(proof_element), 'replaced')

    expect(document.getElementById('proof')).toBeNull()
    expect(document.body.innerHTML).toContain('replaced')
  })

  it('should append to target', function(){
    expect(document.body.innerHTML).not.toContain('appended')

    $.SrBuj.changeDom('POST', $(proof_element), 'appended')

    expect(document.getElementById('proof')).not.toBeNull()
    expect(document.body.innerHTML).toContain('appended')
  })

  it('should "html" target', function(){
    expect(document.body.innerHTML).not.toContain('htmling')

    $.SrBuj.changeDom('SAMPLE', $(proof_element), 'htmling')

    expect(document.getElementById('proof')).not.toBeNull()
    expect(document.body.innerHTML).toContain('htmling')
  })
})
