// List of options for entry categories
// ! DO NOT CHANGE THIS

export const categories = [
   { id: -1, name: "No filter", chipColorScheme: "error" },
   { id: 0, name: "Default", chipColorScheme: "info" },
   { id: 1, name: "Startup", chipColorScheme: "success" },
   { id: 2, name: "Nonprofit", chipColorScheme: "warning" },
   { id: 3, name: "Misc", chipColorScheme: "secondary" }
];

export function getCategory(category_id) {
   return categories.find(x => x.id === category_id)
}