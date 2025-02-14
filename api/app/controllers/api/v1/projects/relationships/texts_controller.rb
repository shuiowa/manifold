module API
  module V1
    module Projects
      module Relationships
        class TextsController < AbstractProjectChildController

          resourceful! Text do
            @project.texts
          end

          def create
            @text = ::Updaters::Text.new(text_params).update(@project.texts.new, creator: @current_user)
            render_single_resource @text
          end

        end
      end
    end
  end
end
