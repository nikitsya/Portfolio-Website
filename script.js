const projectData = {
  sunset: {
    title: "Sunset Atelier",
    meta: "Brand Identity • 2026",
    description:
      "A soft visual identity system with warm typography, packaging direction, and social templates.",
    points: [
      "Logo and mini brand guide.",
      "Color and material palette for product visuals.",
      "Instagram post and story template set."
    ]
  },
  softmotion: {
    title: "Soft Motion",
    meta: "Landing Page • 2026",
    description:
      "A clean one-page website concept focused on storytelling blocks and smooth transitions.",
    points: [
      "Simple section hierarchy for conversion.",
      "Pastel visual style with strong readability.",
      "Mobile-first layout planning."
    ]
  },
  goldenhour: {
    title: "Golden Hour",
    meta: "Social Campaign • 2025",
    description:
      "A short campaign direction for product launch content with cinematic light references.",
    points: [
      "Creative direction for short videos.",
      "Caption framework and publishing rhythm.",
      "Visual references board and post concepts."
    ]
  },
  pinksignals: {
    title: "Pink Signals",
    meta: "Creative Concept • 2025",
    description:
      "An experimental concept mixing minimal interface ideas with playful editorial visuals.",
    points: [
      "Exploration of custom type and spacing.",
      "Poster system with modular compositions.",
      "Prototype for online presentation."
    ]
  }
};

const titleNode = document.getElementById("project-title");
const metaNode = document.getElementById("project-meta");
const descriptionNode = document.getElementById("project-description");
const pointsNode = document.getElementById("project-points");
const openButtons = document.querySelectorAll(".open-project");
const yearNode = document.getElementById("year");

function renderProject(projectId) {
  const project = projectData[projectId];

  if (!project || !titleNode || !metaNode || !descriptionNode || !pointsNode) {
    return;
  }

  titleNode.textContent = project.title;
  metaNode.textContent = project.meta;
  descriptionNode.textContent = project.description;
  pointsNode.innerHTML = "";

  project.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    pointsNode.appendChild(item);
  });

  document.getElementById("project-view")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const projectId = button.dataset.project;

    if (projectId) {
      renderProject(projectId);
    }
  });
});

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
