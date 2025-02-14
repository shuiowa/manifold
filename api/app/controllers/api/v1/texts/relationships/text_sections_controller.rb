module API
  module V1
    module Texts
      module Relationships
        class TextSectionsController < ApplicationController
          before_action :set_text, only: [:index, :create]

          resourceful! TextSection, authorize_options: { except: [:index] } do
            @text.text_sections
          end

          def index
            @text_sections = load_text_sections
            location = api_v1_text_relationships_text_sections_url(@text)

            render_multiple_resources(
              @text_sections,
              location: location
            )
          end

          def create
            @text_section = authorize_and_create_text_section(text_section_params)
            render_single_resource @text_section
          end

          private

          def set_text
            @text = Text.friendly.find(params[:text_id])
          end
        end
      end
    end
  end
end
