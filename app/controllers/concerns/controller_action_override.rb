# frozen_string_literal: true

module ControllerActionOverride
  extend ActiveSupport::Concern

  class_methods do
    def ctrl_action_override_chain
      @_ctrl_action_override_chain ||= []
    end

    def add_controller_action_override(controller_path, action_name, initial_action:, &override_condition)
      ctrl_action_override_chain << {
        controller_path: controller_path,
        controller_name: controller_path.split('/').last,
        action_name: action_name,
        initial_action: initial_action,
        override_condition: override_condition
      }
    end

    def set_controller_action_override
      helper do
        # rubocop:disable Lint/NestedMethodDefinition
        def ctrl_action_override_chain
          controller.class.ctrl_action_override_chain
        end
        # rubocop:enable Lint/NestedMethodDefinition

        define_method :controller_action_override_spec do
          strong_memoize(:controller_action_override_spec) do
            override = nil

            ctrl_action_override_chain.reverse.each do |o|
              should_override = controller.action_name == o[:initial_action]

              if o[:override_condition]
                should_override &&= instance_eval(&o[:override_condition])
              end

              if should_override
                override = o
                break # rubocop:disable Cop/AvoidBreakFromStrongMemoize
              end
            end

            override
          end
        end

        define_method :controller_action_override do |key|
          controller_action_override_spec && controller_action_override_spec[key]
        end

        define_method :controller_path do
          controller_action_override(:controller_path) || super()
        end

        define_method :controller_name do
          controller_action_override(:controller_name) || super()
        end

        define_method :action_name do
          controller_action_override(:action_name) || super()
        end
      end
    end
  end
end
