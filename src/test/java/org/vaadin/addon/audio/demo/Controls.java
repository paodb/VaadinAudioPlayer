package org.vaadin.addon.audio.demo;

import com.vaadin.flow.component.HasComponents;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.HtmlImport;
import com.vaadin.flow.component.dependency.Uses;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.templatemodel.TemplateModel;
import org.vaadin.addon.audio.server.AudioPlayer;
import org.vaadin.addon.audio.server.state.PlaybackState;
import org.vaadin.addon.audio.server.state.StateChangeCallback;

/**
 * A Designer generated component for the player-controls template.
 * <p>
 * Designer will add and remove fields with @Id mappings but
 * does not overwrite or otherwise change this file.
 */
@Tag("player-controls")
@HtmlImport("player-controls.html")
@Uses(SliderWithCaption.class)
public class Controls extends PolymerTemplate<Controls.PlayerControlsModel> implements HasSize, HasComponents {

    private AudioPlayer player;
    @Id("back5Button")
    private Button back5Button;
    @Id("stopButton")
    private Button stopButton;
    @Id("pauseButton")
    private Button pauseButton;
    @Id("playButton")
    private Button playButton;
    @Id("forward5Button")
    private Button forward5Button;
    @Id("positionSlider")
    private SliderWithCaption positionSlider;
    @Id("volumeSlider")
    private SliderWithCaption volumeSlider;
    @Id("leftGainSlider")
    private SliderWithCaption leftGainSlider;
    @Id("rightGainSlider")
    private SliderWithCaption rightGainSlider;
    @Id("balanceSlider")
    private SliderWithCaption balanceSlider;
    @Id("speedSlider")
    private SliderWithCaption speedSlider;
    @Id("deleteButton")
    private Button deleteButton;

    /**
     * Creates a new PlayerControls.
     */
    public Controls(AudioPlayer player, String streamName) {
        getModel().setStreamName("Stream " + streamName);
        setWidthFull();
        this.player = player;
        getElement().appendChild(player.getElement());

        positionSlider.getSlider().addValueChangeListener(e -> {
            if (e.isFromClient()) {
                player.setPosition(e.getValue().intValue());
            }
        });

        back5Button.addClickListener(e -> player.skip(-5000));
        stopButton.addClickListener(e -> player.stop());
        pauseButton.addClickListener(e -> {
            if (player.isPaused()) {
                player.resume();
            } else {
                player.pause();
            }
        });
        playButton.addClickListener(e -> {
            if (player.isStopped()) {
                player.play();
            } else if (player.isPaused()) {
                player.resume();
            } else {
                // player.play(0);
                player.play();
            }
        });
        forward5Button.addClickListener(e -> player.skip(5000));

        volumeSlider.getSlider().addValueChangeListener(e -> {
            Notification.show("Volume: " + e.getValue());
            player.setVolume(e.getValue());
        });
        leftGainSlider.getSlider().addValueChangeListener(e -> {
            Notification.show("Left gain: " + e.getValue());
            player.setVolumeOnChannel(e.getValue(), 0);
        });
        rightGainSlider.getSlider().addValueChangeListener(e -> {
            Notification.show("Right gain: " + e.getValue());
            player.setVolumeOnChannel(e.getValue(), 1);
        });
        balanceSlider.getSlider().addValueChangeListener(e -> {
            Notification.show("Balance: " + e.getValue());
            player.setBalance(e.getValue());
        });
        speedSlider.getSlider().addValueChangeListener(e -> {
            Notification.show("Speed: " + e.getValue());
            player.setPlaybackSpeed(e.getValue());
        });

        deleteButton.addClickListener(e -> getElement().removeFromParent());

        final UI ui = UI.getCurrent();
        player.getStream().addStateChangeListener(newState -> {
            ui.access(() -> {
                String text = "Stream status: ";
                switch (newState) {
                    case COMPRESSING:
                        text += "COMPRESSING";
                        break;
                    case ENCODING:
                        text += "ENCODING";
                        break;
                    case IDLE:
                        text += "IDLE";
                        break;
                    case READING:
                        text += "READING";
                        break;
                    case SERIALIZING:
                        text += "SERIALIZING";
                        break;
                    default:
                        text += "broken or something";
                        break;
                }
                getModel().setStreamStatus(text);
            });
        });

        player.addStateChangeListener(new StateChangeCallback() {

            @Override
            public void playbackStateChanged(final PlaybackState new_state) {
                ui.access(() -> {
                    String text = "Player status: ";
                    switch (new_state) {
                        case PAUSED:
                            text += "PAUSED";
                            break;
                        case PLAYING:
                            text += "PLAYING";
                            break;
                        case STOPPED:
                            text += "STOPPED";
                            break;
                        default:
                            break;
                    }
                    getModel().setPlayerStatus(text);
                });
            }

            @Override
            public void playbackPositionChanged(final int new_position_millis) {
                ui.access(() -> {
                    // TODO: for proper slider setting, we need to know the position
                    // in millis and total duration of audio
                    int duration = player.getDuration();
                    int pos = player.getPosition();
                    positionSlider.getSlider().setMaxValue(duration);
                    positionSlider.getSlider().setMinValue(0.0);
                    // set value without trigger value change event
                    positionSlider.getSlider().setValue((double) new_position_millis);
                    getModel().setTime(player.getPositionString() + " / " + player.getDurationString());
                });
            }
        });

    }

    /**
     * This model binds properties between PlayerControls and player-controls
     */
    public interface PlayerControlsModel extends TemplateModel {
        String getPlayerStatus();

        void setPlayerStatus(String playerStatus);

        String getStreamStatus();

        void setStreamStatus(String streamStatus);

        String getStreamName();

        void setStreamName(String streamName);

        String getTime();

        void setTime(String time);
    }
}
