package org.vaadin.addon.audio.server.util;

/**
 * Enum representing what should happen when playback reaches the end of the range.
 * There are tree options:
 * <ul>
 * <li> stop, leaving the playback position at the end of the range (0)
 * <li> stop, resetting the playback position at the start of the range (1)
 * <li> loop, resetting the playback position to the start of the range and continuing play (2)
 * </ul> 
 */
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
