import { Routes } from "@angular/router";
import { AllByeLawsComponent } from "./bye-law/all-bye-laws/all-bye-laws.component";
import { AddByeLawComponent } from "./bye-law/add-bye-law/add-bye-law.component";
import { EditByeLawComponent } from "./bye-law/edit-bye-law/edit-bye-law.component";
import { AllMinutesComponent } from "./minutes/all-minutes/all-minutes.component";
import { AddMinuteComponent } from "./minutes/add-minute/add-minute.component";
import { EditMinuteComponent } from "./minutes/edit-minute/edit-minute.component";
import { AllTrainingSeminarComponent } from "./training-seminar/all-training-seminar/all-training-seminar.component";
import { AddTrainingSeminarComponent } from "./training-seminar/add-training-seminar/add-training-seminar.component";
import { EditTrainingSeminarComponent } from "./training-seminar/edit-training-seminar/edit-training-seminar.component";

export const miscellaneousRoutes: Routes = [
  {
    path: "bye-law",
    component: AllByeLawsComponent,
  },
  {
    path: "add-bye-law",
    component: AddByeLawComponent,
  },
  {
    path: "edit-bye-law:/id",
    component: EditByeLawComponent,
  },
  {
    path: "minutes",
    component: AllMinutesComponent,
  },
  {
    path: "add-minute",
    component: AddMinuteComponent,
  },
  {
    path: "edit-minute:/id",
    component: EditMinuteComponent,
  },
  {
    path: "training-seminar",
    component: AllTrainingSeminarComponent,
  },
  {
    path: "add-training-seminar",
    component: AddTrainingSeminarComponent,
  },
  {
    path: "edit-training-seminar:/id",
    component: EditTrainingSeminarComponent,
  },
];
