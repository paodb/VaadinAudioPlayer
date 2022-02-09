package org.vaadin.addon.audio.server.util;

public enum OnEndOfRange {
  
  STOP_POSITION_END(0), STOP_POSITION_START(1), LOOP_POSITION_START(2);
  
  private int action;

  OnEndOfRange(int action) {
    this.action = action;
  }

  public int getAction() {
    return action;
  }
  
  
}
