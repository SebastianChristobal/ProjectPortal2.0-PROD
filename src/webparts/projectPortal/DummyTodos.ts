export interface Todo {
  projectId: number;
  title: string;
  projectTitle: string;
  description: string;
  contentTypeName: string;
  ongoing: boolean;
}

 export const DummyActivities: Todo[] = [
  {
    projectId: 1,
    title: "Lorem ipsum dolor sit amet",
    projectTitle: "Project Chile",
    description: "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
    contentTypeName: 'Aktivitet',
    ongoing: true
  },
  {
    projectId: 1,
    title: "Donec laoreet nonummy ",
    projectTitle: "Project Isla pao pao",
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
    contentTypeName: 'Aktivitet',
    ongoing: true
  },
  {
    projectId: 1,
    title: "Lorem ipsum dolor sit amet",
    projectTitle: "Project Chile",
    description: "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
    contentTypeName: 'Aktivitet',
    ongoing: false
  },
  {
    projectId: 1,
    title: "Donec nonummy ",
    projectTitle: "Power Project ",
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
    contentTypeName: 'Aktivitet',
    ongoing: true
  },
  // Add more todos as needed
];

export const DummyControlpoints: Todo[] = [
  {
    projectId: 1,
    title: "Lorem ipsum dolor sit amet",
    projectTitle: "Project Chile",
    description: "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
    contentTypeName: 'Kontrollpunkt',
    ongoing: true
  },
  {
    projectId: 1,
    title: "Donec laoreet nonummy ",
    projectTitle: "Project Isla pao pao",
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
    contentTypeName: 'Kontrollpunkt',
    ongoing: true
  },
  {
    projectId: 1,
    title: "Lorem ipsum dolor sit amet",
    projectTitle: "Project Chile",
    description: "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
    contentTypeName: 'Kontrollpunkt',
    ongoing: false
  },
  {
    projectId: 1,
    title: "Donec nonummy ",
    projectTitle: "Power Project ",
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
    contentTypeName: 'Kontrollpunkt',
    ongoing: false
  },
  // Add more todos as needed
];
