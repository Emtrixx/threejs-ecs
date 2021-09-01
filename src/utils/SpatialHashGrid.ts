import { math } from "./math";

export class SpatialHashGrid{
        cells: any[][];
        dimensions: any;
        bounds: any;
        queryIds: number;
        
        constructor(bounds:Array<Array<number>> ,dimensions: Array<number>) {
          const [x, y] = dimensions;
          this.cells = [...Array(x)].map(_ => [...Array(y)].map(_ => (null)));
          this.dimensions = dimensions;
          this.bounds = bounds;
          this.queryIds = 0;
        }
      
        GetCellIndex(position) {
          const x = math.sat((position[0] - this.bounds[0][0]) / (
              this.bounds[1][0] - this.bounds[0][0]));
          const y = math.sat((position[1] - this.bounds[0][1]) / (
              this.bounds[1][1] - this.bounds[0][1]));
      
          const xIndex = Math.floor(x * (this.dimensions[0] - 1));
          const yIndex = Math.floor(y * (this.dimensions[1] - 1));
      
          return [xIndex, yIndex];
        }


      
        NewClient(position, dimensions) {
          const client = {
            position: position,
            dimensions: dimensions,
            cells: {
              min: null,
              max: null,
              nodes: null,
            },
            queryId: -1,
          };
      
          this.Insert(client);
      
          return client;
        }
      
        UpdateClient(client) {
          const [x, y] = client.position;
          const [w, h] = client.dimensions;

          // console.log(client);
      
          const i1 = this.GetCellIndex([x - w / 2, y - h / 2]);
          const i2 = this.GetCellIndex([x + w / 2, y + h / 2]);
       
      
          if (client.cells.min[0] == i1[0] &&
              client.cells.min[1] == i1[1] &&
              client.cells.max[0] == i2[0] &&
              client.cells.max[1] == i2[1]) {
            return;
          }
      
          this.Remove(client);
          this.Insert(client);
        }
      
        FindNear(position, bounds) {
          const [x, y] = position;
          const [w, h] = bounds;
      
          const i1 = this.GetCellIndex([x - w / 2, y - h / 2]);
          const i2 = this.GetCellIndex([x + w / 2, y + h / 2]);

            
          const clients = [];
          const queryId = this.queryIds++;
      
          for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
              let head = this.cells[x][y];
                // console.log(head);
              while (head) {
                const v = head.client;
                head = head.next;
      
                if (v.queryId != queryId) {
                  v.queryId = queryId;
                  clients.push(v);
                //   console.log(clients);
                }
              }
            }
          }
          return clients;
        }

        getCellPosition(position): Array<number>{
          const [x, y] = position;     
          const i = this.GetCellIndex([x, y]);
          //Hardcoded for current grid
          i[0] = (i[0] + 1 - 50) * 20 ;
          i[1] = (i[1] + 1- 50) * 20
          return i
        }
      
        Insert(client) {
          const [x, y] = client.position;
          const [w, h] = client.dimensions;
      
          const i1 = this.GetCellIndex([x - w / 2, y - h / 2]);
          const i2 = this.GetCellIndex([x + w / 2, y + h / 2]);
      
          const nodes = [];
      
          for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            nodes.push([]);
      
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
              const xi = x - i1[0];
      
              const head = {
                next: null,
                prev: null,
                client: client,
              };
      
              nodes[xi].push(head);
      
              head.next = this.cells[x][y];
              if (this.cells[x][y]) {
                this.cells[x][y].prev = head;
              }
      
              this.cells[x][y] = head;
            }
          }
      
          client.cells.min = i1;
          client.cells.max = i2;
          client.cells.nodes = nodes;
        }
      
        Remove(client) {
          const i1 = client.cells.min;
          const i2 = client.cells.max;
      
          for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
              const xi = x - i1[0];
              const yi = y - i1[1];
              const node = client.cells.nodes[xi][yi];
      
              if (node.next) {
                node.next.prev = node.prev;
              }
              if (node.prev) {
                node.prev.next = node.next;
              }
      
              if (!node.prev) {
                this.cells[x][y] = node.next;
              }
            }
          }
      
          client.cells.min = null;
          client.cells.max = null;
          client.cells.nodes = null;
        }
      }