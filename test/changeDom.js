describe('SrBuj changeDom function', function(){

  beforeEach(function(){
    document.body = document.createElement('body')
    html = '<div><span id="proof"></span></div>'
    document.body.innerHTML = html

    proof_element = document.getElementById('proof')
  })

  it('show version', function(){
    expect($.SrBuj.version).toBe('0.9.2')
  })

  it('delete target', function(){
    $.SrBuj.changeDom('DELETE', $(proof_element))
    expect(document.getElementById('proof')).toBeNull()
  })

  it('replace target', function(){
    expect(document.body.innerHTML).not.toContain('replaced')

    $.SrBuj.changeDom('PATCH', $(proof_element), 'replaced')

    expect(document.getElementById('proof')).toBeNull()
    expect(document.body.innerHTML).toContain('replaced')
  })

  it('append to target', function(){
    expect(document.body.innerHTML).not.toContain('appended')

    $.SrBuj.changeDom('POST', $(proof_element), 'appended')

    expect(document.getElementById('proof')).not.toBeNull()
    expect(document.body.innerHTML).toContain('appended')
  })

  it('"html" target', function(){
    expect(document.body.innerHTML).not.toContain('htmling')

    $.SrBuj.changeDom('SAMPLE', $(proof_element), 'htmling')

    expect(document.getElementById('proof')).not.toBeNull()
    expect(document.body.innerHTML).toContain('htmling')
  })

  it('raises a notification', function(){
    jasmine.Clock.useMock()
    $.SrBuj.Util.notify({ message: 'This is madness!', time: 20 })

    jasmine.Clock.tick(30)
    expect(document.getElementsByClassName('srbuj-notify').length).not.toBeGreaterThan(0)
  })

  it('raises a notification that stays', function(){
    jasmine.Clock.useMock()
    $.SrBuj.Util.notify({ message: 'Sticked is madness!', time: -1 })

    jasmine.Clock.tick(30)
    expect(document.getElementsByClassName('srbuj-notify').length).toBeGreaterThan(0)
  })

  it('prevent 304 on browsers cache', function() {
    for (var i = 0; i < 2; i++) {
      $.SrBuj.Util.link({ href: '/', target: true, force_refresh: true })
    }

    var links = document.querySelectorAll('[id^=_srbujLink_]')

    expect(links.length).toEqual(2)
    expect(links[0].href).not.toEqual(links[1].href)
  });

})
