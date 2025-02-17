export interface Choice {
  text: string
  nextNodeId: string
}

export interface NodeData {
  title: string
  content?: string
  choices?: Choice[]
}
