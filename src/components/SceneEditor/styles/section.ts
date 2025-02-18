import { css } from '@emotion/css'

export const selectionStyles = css`
  /* 临时选区样式（拖动时） */

  /* 使用 transform 替代直接修改位置属性 */
  .react-flow__nodesselection-rect {
    transform: scale(1.2);
    background: rgba(72, 118, 255, 0.08);
    border: 2px solid rgba(75, 121, 232, 0.92);
    border-radius: 1rem;
    will-change: transform;
  }

  /* 使用 CSS transforms 进行动画 */
  .react-flow__node {
    will-change: transform;
    transition: transform 0.2s ease;
  }

  /* 鼠标样式 */
  /* 画布初始状态 */
  //.react-flow__pane {
  //  cursor: default;
  //}
  //
  ///* 画布拖动状态（滚轮按下） */
  //&[data-panning="true"] .react-flow__pane {
  //  cursor: grab;
  //
  //  &:active {
  //    cursor: grabbing;
  //  }
  //}
  //
  ///* 拖动选择时的状态 */
  //.react-flow__pane:active {
  //  cursor: crosshair;
  //}
  //
  ///* 节点拖动样式 */
  //.react-flow__node {
  //  cursor: move;
  //}
`
