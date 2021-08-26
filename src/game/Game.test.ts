import { Game } from './Game'
import Entity from '../utils/ecs/Entity'
import IComponent from '../utils/ecs/IComponent'

class C1 implements IComponent {
  public Entity: Game
  public awake(): void { /*...*/ }
  public update(deltaTime: number): void { /*...*/ }
}
class C2 implements IComponent {
  public Entity: Game
  public awake(): void { /*...*/ }
  public update(deltaTime: number): void { /*...*/ }
}
class C3 implements IComponent {
  public Entity: Game
  public awake(): void { /*...*/ }
  public update(deltaTime: number): void { /*...*/ }
}

class E1 extends Entity { }
class E2 extends Entity { }
class E3 extends Entity { }
// --- ADD --- //

describe('>>> Game', () => {
  // --- ADD --- //
  let game: Game
	
  const c1 = new C1()
  const c2 = new C2()
  const c3 = new C3()

  const e1 = new E1()
  const e2 = new E2()
  const e3 = new E3()

  beforeEach(() => {
    game = new Game()
    game.entities.push(e1, e2, e3)

    window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb())
  })
  // --- ADD --- //

  it('should start update loop next frame after awake', () => {
    // --- ADD --- //
    const spy = jest.spyOn(game, 'update')

    game.awake()

    expect(spy).toHaveBeenCalledTimes(1)
    // --- ADD --- //
  })

  it('should awake all Components', () => {
    // --- ADD --- //
    const spy1 = jest.spyOn(c1, 'awake')
    const spy2 = jest.spyOn(c2, 'awake')
    const spy3 = jest.spyOn(c3, 'awake')

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
    expect(spy3).not.toBeCalled()

    game.addComponent(c1)
    game.addComponent(c2)
    game.addComponent(c3)

    game.awake()

    expect(spy1).toBeCalled()
    expect(spy2).toBeCalled()
    expect(spy3).toBeCalled()
    // --- ADD --- //
  })

  it('should update all Components', () => {
    // --- ADD --- //
    const spy1 = jest.spyOn(c1, 'update')
    const spy2 = jest.spyOn(c2, 'update')
    const spy3 = jest.spyOn(c3, 'update')

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
    expect(spy3).not.toBeCalled()

    game.addComponent(c1)
    game.addComponent(c2)
    game.addComponent(c3)

    game.update()

    expect(spy1).toBeCalled()
    expect(spy2).toBeCalled()
    expect(spy3).toBeCalled()
    // --- ADD --- //
  })

  it('should awake all children', () => {
    // --- ADD --- //
    const spy1 = jest.spyOn(e1, 'awake')
    const spy2 = jest.spyOn(e2, 'awake')
    const spy3 = jest.spyOn(e3, 'awake')

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
    expect(spy3).not.toBeCalled()

    game.awake()

    expect(spy1).toBeCalled()
    expect(spy2).toBeCalled()
    expect(spy3).toBeCalled()
    // --- ADD --- //
  })

  it('should update all children', () => {
    // --- ADD --- //
    const spy1 = jest.spyOn(e1, 'update')
    const spy2 = jest.spyOn(e2, 'update')
    const spy3 = jest.spyOn(e3, 'update')

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
    expect(spy3).not.toBeCalled()

    game.update()

    expect(spy1).toBeCalled()
    expect(spy2).toBeCalled()
    expect(spy3).toBeCalled()
    // --- ADD --- //
  })

  // ... //
})