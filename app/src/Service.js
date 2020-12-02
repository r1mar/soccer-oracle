import FieldError from "./FieldError";
import NotFoundError from "./NotFoundError";
import MultipleError from "./MultipleError";

class Service {
  constructor() {
    this.data = {
      teams: [
        {
          id: 1,
          name: "Mönchen Gladbach"
        },
        {
          id: 2,
          name: "1. FC Köln"
        },
        {
          id: 3,
          name: "Bayer Leverkusen"
        },
        {
          id: 4,
          name: "FC Bayern"
        },
        {
          id: 5,
          name: "Schalke"
        },
        {
          id: 6,
          name: "Vfb"
        },
        {
          id: 7,
          name: "Freiburg"
        },
        {
          id: 8,
          name: "SGE"
        },
        {
          id: 9,
          name: "Arminia"
        }
      ],
      matches: [
        {
          id: 1,
          host: {
            id: 4,
            goals: 8,
            name: "FC Bayern"
          },
          guest: {
            id: 5,
            goals: 0,
            name: "Schalke"
          },
          gameDay: "2020-01-01"
        },
        {
          id: 2,
          host: {
            id: 6,
            goals: 2,
            name: "Vfb"
          },
          guest: {
            id: 7,
            goals: 3,
            name: "Freiburg"
          },
          gameDay: "2020-02-01"
        },
        {
          id: 3,
          host: {
            id: 8,
            goals: 1,
            name: "SGE"
          },
          guest: {
            id: 9,
            goals: 1,
            name: "Arminia"
          },
          gameDay: "2020-03-01"
        }
      ]
    };

    this.metadata = {
      paths: [
        {
          name: "/team/:id",
          type: "team",
          collection: "teams"
        },
        {
          name: "/teams",
          type: "team",
          sort: this.sortTeams,
          collection: "teams"
        },
        {
          name: "/match/:id",
          type: "match",
          validate: this.validateMatch,
          collection: "matches"
        },
        {
          name: "/matches",
          type: "match",
          sort: this.sortMatch,
          collection: "matches"
        }
      ],
      types: [
        {
          name: "match",
          properties: [
            {
              name: "id",
              type: "number",
              label: "#",
              isKey: true,
              autoIncrement: true
            },
            {
              name: "gameDay",
              type: "date",
              label: "Spieltag",
              required: true
            },
            {
              name: "host",
              type: "participant",
              label: "Gastgeber",
              required: true,
              valueList: {
                path: "/teams",
                id: "id",
                value: "name"
              }
            },
            {
              name: "guest",
              type: "participant",
              label: "Gast",
              required: true,
              valueList: {
                path: "/teams",
                id: "id",
                value: "name"
              }
            }
          ]
        },
        {
          name: "team",
          form: [
            {
              path: "name",
              meta: "/team/name",
              type: "TextBox"
            }
          ],
          properties: [
            {
              name: "$uri",
              value: "/team/{id}"
            },
            {
              name: "id",
              type: "number",
              label: "#",
              isKey: true,
              autoIncrement: true
            },
            {
              name: "name",
              type: "string",
              label: "Name",
              isName: true,
              required: true
            }
          ]
        },
        {
          name: "participant",
          properties: [
            {
              name: "id",
              type: "number",
              required: true
            },
            {
              name: "name",
              type: "string",
              required: true
            },
            {
              name: "goals",
              type: "number",
              label: "Tore",
              min: 0,
              required: true
            }
          ]
        }
      ]
    };
/*
    this.batch = [];
    this.interrupt = 0;
    this.pending = 0;
    this.executeBatch = this.executeBatch.bind(this);*/
  }

  /*startBatch() {
    if (!this.pending) {
      this.pending = setTimeout(this.executeBatch, this.interrupt);
    }
  }

  executeBatch() {
    this.batch.forEach(batchRequest => {
      try {
        batchRequest.resolve(result);
      } catch (e) {
        batchRequest.reject(e);
      }
    });
  }*/

  post() {}

  createEntity(path, data) {
    return new Promise((resolve, reject) => {
      try {
        this.batch.push({
          method: "post",
          path: path,
          resolve: resolve,
          reject: reject
        });
        this.startBatch();

        let metadataPath = this.getMetaPath(path),
          collection = this.getCollection(path, metadataPath);

        if (!path) {
          throw new Error("Pfad nicht angegeben");
        }

        this.determineEntity(metadataPath, collection, "create", data);
        this.validateEntity(metadataPath, collection, "create", data);

        collection.push(Object.assign({}, data));
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  readEntity(path) {
    return new Promise((resolve, reject) => {
      try {
        let metadataPath = this.getMetaPath(path),
          collection = this.getCollection(path, metadataPath);

        if (!path) {
          throw new Error("Pfad nicht angegeben");
        }

        let result = collection.find(entity =>
          this.entityEquals(path, metadataPath, entity)
        );

        if (result) {
          resolve(Object.assign({}, result));
        } else {
          throw new NotFoundError(`Entität nicht gefunden`);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  readEntities(path) {
    return new Promise((resolve, reject) => {
      try {
        let metadataPath = this.getMetaPath(path),
          collection = this.getCollection(path, metadataPath);

        if (!path) {
          throw new Error("Pfad nicht angegeben");
        }

        let result = collection.filter(entity =>
          this.entityEquals(path, metadataPath, entity)
        );

        if (result && !result.length) {
          resolve(result);
        }

        if (metadataPath.sort) {
          result = result.sort(metadataPath.sort);
        }

        resolve(result.map(entity => Object.assign({}, entity)));
      } catch (e) {
        reject(e);
      }
    });
  }

  metaRecursiv(metadata, parts) {
    if (!parts.length) {
      return metadata;
    }
    let property = metadata.properties.find(
      property => property.name === parts[0]
    );

    if (parts.length === 1) {
      return property;
    } else {
      let type = this.metadata.type.find(type => type.name === property.type);
      parts.splice(1);

      if (!type) {
        throw new Error(`Pfad "${parts[0]}" nicht auflösbar`);
      } else {
        return this.metaRecursiv(type, parts);
      }
    }
  }

  readMetadata(path) {
    return new Promise((resolve, reject) => {
      try {
        let parts = path.split("/").filter(part => part),
          result;
        if (!parts.length) {
          throw new Error("Metadatenpfad nicht angegeben");
        }

        result = this.metadata.types.find(type => type.name === parts[0]);
        if (!result) {
          throw new Error(`Pfad "${parts[0]}" konnte nicht aufgelöst werden`);
        }

        result = this.metaRecursiv(result, parts.splice(1));

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  updateEntity(path, data) {
    return new Promise((resolve, reject) => {
      try {
        let metadataPath = this.getMetaPath(path),
          collection = this.getCollection(path, metadataPath);

        if (!path) {
          throw new Error("Pfad nicht angegeben");
        }

        let result = collection.find(entity =>
          this.entityEquals(path, metadataPath, entity)
        );

        if (result) {
          Object.assign(result, data);

          this.determineEntity(metadataPath, collection, "update", result);
          this.validateEntity(metadataPath, collection, "update", result);

          resolve(Object.assign({}, result));
        } else {
          throw new NotFoundError();
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  deleteEntity(path) {
    return new Promise((resolve, reject) => {
      try {
        let metadataPath = this.getMetaPath(path),
          collection = this.getCollection(path, metadataPath);

        if (!path) {
          throw new Error("Pfad nicht angegeben");
        }

        let result = collection.find(entity =>
          this.entityEquals(path, metadataPath, entity)
        );

        if (result) {
          let index = collection.indexOf(result);

          collection.splice(index, 1);
          resolve();
        } else {
          throw new NotFoundError();
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  getMetaPath(path) {
    return this.metadata.paths.find(metaPath => {
      // /team/:id
      let metaRegex = metaPath.name.replace(/:\w+/g, "([^/]+)"),
        matches = path.match(metaRegex),
        paramMatches = metaPath.name.match(/:\w+/g);
      // /team/([^/]+)
      // [ "/team/:id", ":id" ]
      // [ ":id" ]

      //Filter auf untypisierten Regex fehlgeschlagen
      if (!matches || !matches.length) {
        return false;
      }

      if (!paramMatches) {
        //keine parameter vorhanden
        return true;
      }

      // typisierten Regex erstellen
      metaRegex = metaPath.name;
      paramMatches.forEach(match => {
        let type = this.metadata.types.find(
          type => type.name === metaPath.type
        );

        let property = type.properties.find(property => {
            return property.name === match.substring(1);
          }),
          paramRegex;
        switch (property.type) {
          case "number":
            paramRegex = "([0-9]+)";
            break;

          case "string":
            paramRegex = "([^/]+)";
        }
        metaRegex = metaRegex.replace(":" + property.name, paramRegex);
      });

      // gegen typisiertes Regex testen
      matches = path.match(metaRegex);

      //Filter auf typisierten Regex
      if (!matches || !matches.length) {
        return false;
      }

      return matches[0] === path;
    });
  }

  getCollection(path, metadataPath) {
    if (!metadataPath) {
      throw new NotFoundError(`Ressource "${path}" nicht gefunden`);
    }

    return this.data[metadataPath.collection];
  }

  entityEquals(path, metadataPath, entity) {
    //Pfad aus der Entität erstellen udn mit dem übergebenen Pfad abgleichen
    let type = this.metadata.types.find(
        type => type.name === metadataPath.type
      ),
      entityPath = metadataPath.name;

    // Wenn keine Parameter definiert ist, dann ist alles ein Treffer
    if (metadataPath.name.search(":") === -1) {
      return true;
    }

    type.properties.forEach(
      property =>
        (entityPath = entityPath.replace(
          ":" + property.name,
          entity[property.name]
        ))
    );

    return path === entityPath;
  }

  determineEntity(metadataPath, collection, operation, data) {
    let type = this.metadata.types.find(
        type => type.name === metadataPath.type
      ),
      uri = type.properties.find(property => property.name === "$uri").value;
    alert(uri);

    type.properties.forEach(
      property =>
        (uri = uri.replace("{" + property.name + "}", data[property.name]))
    );
    data["$uri"] = uri;

    if (operation === "create") {
      type.properties.forEach(property => {
        if (property.autoIncrement) {
          let maxValue = -1;

          collection.forEach(entity => {
            maxValue =
              entity[property.name] > maxValue
                ? entity[property.name]
                : maxValue;
          });

          data[property.name] = ++maxValue;
        }
      });
    }

    if (type.determine) {
      type.determine(metadataPath, collection, operation, data);
    }
  }

  validateProperties(property, data, error) {
    if (property.required && !data[property.name]) {
      error.errors.push(new FieldError(property.name));
    }

    //rekursiver Aufruf für die Validierung
    if (this.metadata.types[property.type] && data[property.name]) {
      let type = this.metadata.types[property.type];

      type.properties.forEach(property =>
        this.validateProperties(property, data[property.name], error)
      );
    }
  }

  validateEntity(metadataPath, collection, operation, data) {
    let error = new MultipleError(),
      type = this.metadata.types.find(type => type.name === metadataPath.type);

    type.properties.forEach(property =>
      this.validateProperties(property, data, error)
    );

    switch (error.errors.length) {
      case 0:
        break;
      case 1:
        throw error.errors[0];
      default:
        throw error;
    }

    if (type.validate) {
      type.validate(metadataPath, collection, operation, data);
    }
  }

  sortTeams(team1, team2) {
    if (team1.name > team2.name) {
      return 1;
    }
    if (team1.name < team2.name) {
      return -1;
    }

    return 0;
  }

  validateMatch(metadataPath, collection, operation, data) {
    if (data.host.id === data.guest.id) {
      throw new FieldError(
        "guest.id",
        "Wählen Sie zwei unterschiedliche Teams aus"
      );
    }
  }

  sortMatch(a, b) {
    if (a.gameDay > b.gameDay) {
      return 1;
    }
    if (a.gameDay < b.gameDay) {
      return -1;
    }
    if (a.host.name > b.host.name) {
      return 1;
    }
    if (a.guest.name < b.guest.name) {
      return -1;
    }

    return 0;
  }

  readAll() {
    return new Promise((resolve, reject) => {
      resolve(this.data);
    });
  }
}

const service = new Service();

export default service;
