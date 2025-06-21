import { Routes } from "@angular/router";
import { AddShareTypeComponent } from "./add-share-type/add-share-type.component";
import { EditShareTypeComponent } from "./edit-share-type/edit-share-type.component";

export const shareTypeRoutes: Routes = [
  {
    path: "add-share-type",
    component: AddShareTypeComponent,
  },
  {
    path: "edit-share-type/:id",
    component: EditShareTypeComponent,
  },
];
