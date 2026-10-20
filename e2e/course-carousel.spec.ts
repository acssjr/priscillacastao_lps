import { test, expect } from "@playwright/test";

test("GSAP carousel moves intact cards without a blank text phase", async ({page})=>{
  await page.goto("/catalogo#cursos");
  const carousel=page.locator('[class*="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  const next=carousel.getByRole("button",{name:"Próximo curso"});
  await next.click();
  await expect(carousel).toHaveAttribute("data-phase","moving");
  await next.dispatchEvent("click",{detail:1});
  // During the whole motion, text stays opaque inside every moving surface.
  const samples=await carousel.evaluate(async node=>{
    const values:number[]=[];
    for(let i=0;i<12;i++){
      node.querySelectorAll('[class*="copy"]').forEach(copy=>values.push(Number(getComputedStyle(copy).opacity)));
      await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    }
    return values;
  });
  expect(Math.min(...samples)).toBe(1);
  await expect(carousel).toHaveAttribute("data-phase","idle");
  await expect(carousel.locator('article[data-active="true"] h3')).toHaveText("Musicalidade");
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(carousel).toHaveAttribute("data-phase","idle");
  await expect(carousel.locator('article[data-active="true"] h3')).toHaveText("Autonomia e criatividade");
});
test("selected course stays centered and compact while all three purchase links match their course", async ({ page }) => {
  await page.setViewportSize({width:535,height:668});
  await page.goto("/catalogo#cursos");
  const carousel = page.locator('[class*="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  await expect(page.getByRole("group",{name:"Escolher curso"})).toHaveCount(0);
  await expect(page.locator("#cursos")).toContainText("Cada curso tem duração de 1h");
  for (const title of ["Consciência corporal","Musicalidade","Autonomia e criatividade"]) {
    await expect(carousel).toHaveAttribute("data-phase","idle");
    await expect(carousel.locator('article[data-active="true"]').getByRole("heading")).toHaveText(title);
    const card = carousel.locator('article[data-active="true"]');
    const action = card.getByRole("link",{name:"Quero adquirir esse curso"});
    await expect(action).toBeVisible();
    expect(new URL((await action.getAttribute("href"))!).searchParams.get("text")).toContain(title.toLowerCase());
    await expect.poll(async () => {
      const box = (await card.boundingBox())!, button = (await action.boundingBox())!;
      return Math.abs(box.x+box.width/2-button.x-button.width/2);
    }).toBeLessThan(1);
    const box = (await card.boundingBox())!, button = (await action.boundingBox())!;
    expect(box.y+box.height-button.y-button.height).toBeLessThan(30);
    const gaps=await card.evaluate(node=>{
      const text=node.querySelector("p")!.getBoundingClientRect(),price=node.querySelector("strong")!.getBoundingClientRect(),cta=node.querySelector("a")!.getBoundingClientRect();
      return {above:price.top-text.bottom,below:cta.top-price.bottom};
    });
    expect(Math.abs(gaps.above-gaps.below)).toBeLessThan(1);
    await expect.poll(() => card.locator('[class*="borderBeam"]>span').evaluate(node=>getComputedStyle(node,"::before").animationPlayState)).toBe("running");
    await expect(carousel.locator('article[data-active="false"] [class*="copy"]').first()).toHaveCSS("filter","blur(2.5px)");
    await carousel.getByRole("button",{name:"Próximo curso"}).click();
  }
  await expect(carousel).toHaveAttribute("data-phase","idle");
  const first=carousel.locator('article[data-active="true"]');
  await expect.poll(()=>first.evaluate(node=>new DOMMatrix(getComputedStyle(node).transform).m41)).toBe(0);
  await first.scrollIntoViewIfNeeded();
  const rect=(await first.boundingBox())!;
  await page.mouse.move(rect.x+rect.width*.8,rect.y+100);
  await page.mouse.down();
  await page.mouse.move(rect.x+rect.width*.2,rect.y+100,{steps:10});
  expect(await first.evaluate(node=>getComputedStyle(node).translate)).not.toBe("none");
  await page.mouse.up();
  await expect(carousel.locator('article[data-active="true"]').getByRole("heading")).toHaveText("Musicalidade");
  await page.emulateMedia({reducedMotion:"reduce"});
  expect(await carousel.locator('article[data-active="true"] [class*="borderBeam"]>span').evaluate(node=>getComputedStyle(node,"::before").animationName)).toBe("none");
});
