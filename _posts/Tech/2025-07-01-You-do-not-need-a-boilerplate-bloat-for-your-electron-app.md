---
title: You do not need a boilerplate bloat for your electron app
categories: [tech]
tags: [electron, boilerplate, sqlite, sequelize]
---

I spent some frustrating amount of time setting up my new electron app with React, Tailwind, Sqlite support. I tried all the boilerplate templates and starters but none of them are stable with the changing packages for long term.

# Stack

I wanted a local sqlite setup for which I figured an ORM like sequelize would be good. React/Vue whatever worked with tailwind and basic electron js setup. No amount of configuration, versioning or changing vite and webpack configs helped, just found open issues and unanswered stackoverflow questions.

## Electron + React + Typescript + Tailwind + Sequelize (sqlite) - that's it.

# What worked

Just following the most basic documentation of electron was the only thing then worked and I would suggest that to you too. I will mention the code here partially but it may change in future to please check the documentation [here](https://www.electronforge.io/).

Following [Webpack + Typescript](https://www.electronforge.io/templates/typescript-+-webpack-template) most basic template setup -

`npx create-electron-app@latest my-new-app --template=webpack-typescript`

Then [adding react](https://www.electronforge.io/guides/framework-integration/react-with-typescript) to it

Adding `"jsx": "react-jsx",` to "compilerOptions" in `tsconfig.json`

Install react
```bash
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

Import in `src/renderer.ts`
```ts
// Add this to the end of the existing file
import './app';
```

## Setting up sqlite db

Database util at `database/db.ts`
```ts
import { app } from 'electron'
import path from 'node:path'
import { Sequelize } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';

const dbPath = path.join(app.getPath('userData'), 'yourDatabaseName.db');
console.log(dbPath)
export const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: dbPath,
  logging: false,
})
```

Your database models at `database/models/someModel.ts`
```ts
import { DataTypes } from "@sequelize/core";
import { sequelize } from "../db";

const ModelName = sequelize.define(
    "ModelName",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        }, // however you want to define models
        ...
    },
    {
        tableName: "...",
        freezeTableName: true,
    }
);

export default ModelName;
```

Your database controller at `database/modelController.ts`
```ts
import { ipcMain } from "electron";
import ModelName from "./models/someModel";
import { Op } from "@sequelize/core";

ipcMain.handle('insert-model', async (_event, data) => {
  try {
    const [newModel, created] = await ModelName.findOrCreate({
      where: { id: data.id },
      defaults: {
        // ... // acc to model
      },
    });
    if (!created) {
        // ...
    }
    return whatever;
  } catch (error) {
    console.error('Error inserting/updating model:', error);
    throw error;
  }
});
```

Update/Create `src/preload.ts`
```ts
import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  insertModel: (data: any) => ipcRenderer.invoke('insert-model', data),
  // You can expose other APTs you need here.
  // ...
})
```

In the default `src/index.ts` update the lines
```ts
// Add import 
import { sequelize } from '../database/db';

// ...

// Import controllers and boot db
import "../database/tweetController"

// Before app create window when ready, connect and sync db
try {
  sequelize.authenticate().then(() =>
    console.log('Connection to db has been established successfully.')
  );
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

sequelize.sync().then(() => console.log("Database is ready."))

app.whenReady().then(createWindow)

// ...
```

Run your app
```bash
npm start
```

Hope this helps! Follow me on [X](https://x.com/_diginova)