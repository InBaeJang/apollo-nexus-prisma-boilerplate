import { scalarType } from 'nexus';

export const UUID = scalarType({
  name: "UUID",
  asNexusMethod: "uuid",
  serialize() { /* Todo */ },
  parseValue() { /* Todo */ },
  parseLiteral() { /* Todo */ }
});