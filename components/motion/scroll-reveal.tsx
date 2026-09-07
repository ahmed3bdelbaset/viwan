"use client"
import { useEffect } from "react"

/**
 * ScrollReveal — يُضاف مرة واحدة في app/layout.tsx
 * يراقب كل element يحمل class .reveal ويضيف .is-visible عند ظهوره
 */
export function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReduced) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-visible")
      })
      return
    }

    const observe = (els: NodeListOf<Element>) => {
      els.forEach((el) => observer.observe(el))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )

    observe(document.querySelectorAll(".reveal"))

    // MutationObserver للـ dynamic content
    const mutation = new MutationObserver(() => {
      const newEls = document.querySelectorAll(".reveal:not(.is-visible)")
      observe(newEls)
    })
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])

  return null
}
