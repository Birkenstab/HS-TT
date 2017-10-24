const popovers = []

function init () {
  [...document.querySelectorAll(".lecture")].forEach(element => {
    const lecture = JSON.parse(element.getAttribute("data-lecture"));
    const popover = document.createElement("div")
    popover.className = "popover"

    const name = document.createElement("div")
    name.textContent = lecture.name
    popover.appendChild(name)

    const room = document.createElement("div")
    room.textContent = lecture.room
    popover.appendChild(room)

    const teachers = document.createElement("div")
    teachers.textContent = lecture.teachers.join(", ")
    popover.appendChild(teachers)

    document.body.appendChild(popover)

    popovers.push({
      popover,
      element
    })

    element.addEventListener("mouseenter", () => {
      popover.classList.add("show")
    })
    element.addEventListener("mouseleave", () => {
      popover.classList.remove("show")
    })
  })
  updatePopoverPositions()

  const element = document.querySelector("#updated")
  const date = new Date(parseInt(element.getAttribute("data-updated")))
  const today = new Date()
  let updated = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() ? "Heute" : `${toDigits(date.getDate(), 2)}.${toDigits(date.getMonth() + 1, 2)}.${toDigits(date.getFullYear(), 4)}`
  updated += ` ${toDigits(date.getHours(), 2)}:${toDigits(date.getMinutes(), 2)}:${toDigits(date.getSeconds(), 2)}`
  element.textContent = "Aktualisiert: " + updated

  window.addEventListener("resize", updatePopoverPositions)
}

function updatePopoverPositions () {
  popovers.forEach(({popover, element}) => {
    const elementRect = element.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()

    popover.style.top = (elementRect.top - popoverRect.height - 5) + "px"

    let left = (elementRect.left + elementRect.width / 2 - popoverRect.width / 2)
    if (left < 0)
      left = 0
    if (left + popoverRect.width > window.innerWidth)
      left = window.innerWidth - popoverRect.width
    popover.style.left = left + "px"
  });
}

function toDigits (number, digits) {
  return (new Array(digits).fill("0").join("") + number.toString()).slice(-digits)
}

init()
