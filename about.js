document.fonts.ready.then(() => {
  gsap.set("#quote", {opacity: 1})
  
  let mySplitText = SplitText.create("#quote", { type: "chars, words" });

  gsap.from(mySplitText.chars, {
    duration: 2,
    opacity: 0,
    stagger: { from: "random", each: 0.01 }
  });
});
