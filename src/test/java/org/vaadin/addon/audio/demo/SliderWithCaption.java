package org.vaadin.addon.audio.demo;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.HtmlImport;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.Uses;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.templatemodel.TemplateModel;

/**
 * A Designer generated component for the slider-with-caption template.
 *
 * Designer will add and remove fields with @Id mappings but
 * does not overwrite or otherwise change this file.
 */
@Tag("slider-with-caption")
@JsModule("./slider-with-caption.js")
@Uses(PaperSlider.class)
public class SliderWithCaption extends PolymerTemplate<SliderWithCaption.SliderWithCaptionModel> {

    @Id("slider")
    private PaperSlider slider;

    public SliderWithCaption() {
    }

    /**
     * This model binds properties between SliderWithCaption and slider-with-caption
     */
    public interface SliderWithCaptionModel extends TemplateModel {
        String getCaption();

        void setCaption(String caption);
    }

    public PaperSlider getSlider() {
        return slider;
    }

    public void setSlider(PaperSlider slider) {
        this.slider = slider;
    }

}
