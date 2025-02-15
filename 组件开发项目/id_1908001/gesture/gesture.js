function initGesture (main) {
    // down - start move up - end
    // 1. 抽象出鼠标移动拖拽的事件; 将移动端和pc端的抽象
    // 2. 判断何时拖拽结束
    // 3. 实现"拖拽结束"的逻辑
    /*let x = 0, y = 0
    main.addEventListener("tap", (e) => {
        main.style.transform = `translate(${e.dx + x}px, ${e.dy + y}px)`
    })
    main.addEventListener("panend", (e) => {
        x = x + e.dx
        y = y + e.dy
    })
    main.addEventListener("pancancel", (e) => {
        main.style.transform = `translate(${x}px, ${y}px)`
    })*/
    const start = (e, context) => {
        console.log('start', e.clientX, e.clientY)
        context.startX = e.clientX
        context.startY = e.clientY
        context.isTap = true
        context.isPan = false
        context.flickTime = new Date()
    }
    const move = (e, context) => {
        console.log('move', e.clientX, e.clientY)
        const dx = e.clientX - context.startX
        const dy = e.clientY - context.startY
        if (dx * dx + dy * dy > 100) {
            context.isTap = false
            if (!context.isPan) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    context.isVertical = false
                    context.isHorizontal = true
                } else {
                    context.isVertical = true
                    context.isHorizontal = false
                }
                const panstartE = new Event("panstart")
                panstartE.startX = context.startX
                panstartE.startY = context.startY
                main.dispatchEvent(panstartE)
                context.isPan = true;
            }
        }
        if (context.isPan) {
            const panE = new Event("pan")
            panE.dx = dx
            panE.dy = dy
            panE.isHorizontal = context.isHorizontal
            panE.isVertical = context.isVertical
            main.dispatchEvent(panE)
        }
    }
    const end = (e, context) => {
        if (context.isTap) {
            main.dispatchEvent(new Event("tap"))
        }
        const dx = e.clientX - context.startX, dy = e.clientY - context.startY
        const v = Math.sqrt(dx * dx + dy * dy) / Date.now() - context.flickTime
        if (context.isPan && v > 0.3) {
            context.isFlick = true
            const flickE = new Event("flick")
            main.dispatchEvent(flickE)
        } else {
            context.isFlick = false
        }
        if (context.isPan) {
            const panendE = new Event("panend")
            panendE.dx = dx
            panendE.dy = dy
            panendE.isFlick = context.isFlick
            panendE.isHorizontal = context.isHorizontal
            panendE.isVertical = context.isVertical
            main.dispatchEvent(panendE)
            console.log('end pan', context.startX)
        }
    }
    const cancel = (e, context) => {
        if (context.isPan) {
            main.dispatchEvent(new Event("pancancel"))
        }
    }
    const mousemove = e => {
        move(e, contexts[mouseSymbol])
    }
    const mouseup = e => {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
        end(e, contexts[mouseSymbol])
        delete contexts[mouseSymbol]
    }
    const contexts = Object.create(null)
    const mouseSymbol = Symbol("mouse")
    const mousedown = (e) => {
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
        contexts[mouseSymbol] = Object.create(null)
        start(e, contexts[mouseSymbol])
    }
    main.addEventListener("mousedown", mousedown)
    const touchStart = e => {
        for(const touch of e.changedTouches) {
            contexts[touch.identifier] = Object.create(null)
            start(touch, contexts[touch.identifier])
        }
    }
    const touchmove = e => {
        for(const touch of e.changedTouches) {
            move(touch, contexts[touch.identifier])
        }
    }
    const touchend = e => {
        for(const touch of e.changedTouches) {
            end(touch, contexts[touch.identifier])
        }
    }
    const touchcancel = e => {
        for(const touch of e.changedTouches) {
            cancel(touch, contexts[touch.identifier])
            delete contexts[touch.identifier]
        }
    }
    main.addEventListener("touchstart", touchStart)
    main.addEventListener("touchmove", touchmove)
    main.addEventListener("touchend", touchend)
    main.addEventListener("touchcancel", touchcancel)
}
